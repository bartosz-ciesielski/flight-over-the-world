import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from "three";

// jedno stałe kierunkowe "słońce" świata — używane i przez światło, i przez niebo
export const SUN_DIR = new Vector3(-0.52, 0.62, 0.26).normalize();

// Proceduralne niebo: gradient zenit→horyzont + tarcza słońca + chmury FBM.
// Horyzont ma DOKŁADNIE kolor mgły (w przestrzeni liniowej, przez ten sam
// tone mapping ACES co teren), więc nie ma żadnej przerwy ani poświaty.
export function createSky(fogColorHex, { simple = false } = {}) {
  const uniforms = {
    uZenith: { value: new Color(0x2a63b8) },
    uMid: { value: new Color(0x7db3e2) },
    uHorizon: { value: new Color(fogColorHex) },
    uSunDir: { value: SUN_DIR },
    uSunColor: { value: new Color(0xfff2dd) },
    uTime: { value: 0 },
  };

  const mat = new ShaderMaterial({
    uniforms,
    side: BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vDir;
      uniform vec3 uZenith;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform float uTime;

      ${simple ? "" : `
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * vnoise(p);
          p = p * 2.03 + 17.1;
          a *= 0.5;
        }
        return v;
      }
      `}

      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;

        // gradient nieba — bardzo łagodny przy horyzoncie, żeby nie było pasma
        float t = clamp(h, 0.0, 1.0);
        vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.12, t));
        col = mix(col, uZenith, smoothstep(0.12, 0.65, t));
        if (h < 0.0) col = uHorizon; // pod horyzontem czysta mgła

        // słońce: tarcza + poświata
        float s = max(dot(d, uSunDir), 0.0);
        col += uSunColor * (pow(s, 1400.0) * 8.0 + pow(s, 48.0) * 0.25 + pow(s, 6.0) * 0.05);

        ${simple ? "" : `
        // chmury — rzut kierunku na płaszczyznę, dryf w czasie
        if (h > 0.005) {
          vec2 cuv = d.xz / (h + 0.12) * 0.55;
          cuv += uTime * 0.006;
          float warp = fbm(cuv * 1.7 + 3.1);
          float f = fbm(cuv * 1.15 + warp * 0.9);
          float cov = smoothstep(0.50, 0.74, f);
          float fade = smoothstep(0.02, 0.16, h) * (1.0 - smoothstep(0.75, 1.0, h) * 0.35);
          float shade = fbm(cuv * 2.6 + 8.7);
          vec3 cloud = mix(vec3(0.60, 0.64, 0.70), vec3(1.18, 1.14, 1.07), smoothstep(0.3, 0.9, shade));
          cloud += uSunColor * pow(s, 4.0) * 0.22;
          col = mix(col, cloud, cov * fade * 0.85);
        }
        `}

        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });

  const mesh = new Mesh(new SphereGeometry(5e6, simple ? 16 : 48, simple ? 12 : 24), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  return { mesh, uniforms };
}
