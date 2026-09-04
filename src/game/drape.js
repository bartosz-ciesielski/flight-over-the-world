import * as THREE from "three";

export function worldToMapUv(x, z, bounds) {
  return {
    u: (x - bounds.minX) / bounds.width,
    v: 1 - (z - bounds.minZ) / bounds.depth,
  };
}

export function projectWorldUvs(geometry, bounds) {
  geometry.computeBoundingBox();
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i += 1) {
    const { u, v } = worldToMapUv(pos.getX(i), pos.getZ(i), bounds);
    uvs[i * 2] = u;
    uvs[i * 2 + 1] = v;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}

/** One material; each mesh sets center/size in onBeforeRender so the wall shows that house's aerial photo. */
export function createWallStampMaterial(texture, bounds) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      mapTex: { value: texture },
      worldMin: { value: new THREE.Vector2(bounds.minX, bounds.minZ) },
      worldSize: { value: new THREE.Vector2(bounds.width, bounds.depth) },
      center: { value: new THREE.Vector2(0, 0) },
      bsize: { value: new THREE.Vector2(12, 12) },
    },
    lights: false,
    vertexShader: `
      varying vec3 vWorld;
      varying vec3 vNormalW;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      uniform sampler2D mapTex;
      uniform vec2 worldMin;
      uniform vec2 worldSize;
      uniform vec2 center;
      uniform vec2 bsize;
      varying vec3 vWorld;
      varying vec3 vNormalW;

      vec2 toUv(vec2 xz) {
        return vec2(
          (xz.x - worldMin.x) / worldSize.x,
          1.0 - (xz.y - worldMin.y) / worldSize.y
        );
      }

      void main() {
        vec3 n = normalize(vNormalW);
        vec2 poster = vec2(
          center.x + clamp((vWorld.x - center.x) / max(bsize.x, 0.01), -0.5, 0.5) * bsize.x,
          center.y + mix(-0.48, 0.48, clamp(vWorld.y / 7.2, 0.0, 1.0)) * bsize.y
        );
        vec2 uv = clamp(toUv(poster), vec2(0.001), vec2(0.999));
        vec3 color = texture2D(mapTex, uv).rgb;
        float light = 0.7 + 0.3 * max(dot(n, normalize(vec3(-0.35, 0.82, 0.35))), 0.0);
        gl_FragColor = vec4(color * light, 1.0);
      }
    `,
  });
  mat.customProgramCacheKey = () => "wall-stamp-v1";
  return mat;
}

export function bindWallStamp(mesh, material, ring) {
  const xs = ring.map((p) => p.x);
  const zs = ring.map((p) => p.z);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const w = Math.max(maxX - minX, 2);
  const d = Math.max(maxZ - minZ, 2);
  mesh.onBeforeRender = () => {
    material.uniforms.center.value.set(cx, cz);
    material.uniforms.bsize.value.set(w, d);
  };
}
