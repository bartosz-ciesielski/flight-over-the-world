export const ORIGIN = {
  lat: 52.3859,
  lon: 16.60368,
};

// Środek ul. Jarzębinowej — tu zaczyna się spacer
export const SPAWN = {
  lat: 52.38871,
  lon: 16.60069,
  name: "ul. Jarzębinowa",
};

export const BBOX = {
  south: 52.3765,
  west: 16.588,
  north: 52.3945,
  east: 16.622,
};

export const TILE_ZOOM = 17;
export const PLAYER_RADIUS = 0.55;
export const WALK_SPEED = 4.4;
export const RUN_SPEED = 8.2;
export const EYE_HEIGHT = 1.65;

// Paraglider physics
export const GLIDER = {
  trimSpeed: 38 / 3.6,       // ~10.5 m/s trim airspeed
  maxSpeed: 55 / 3.6,        // ~15.3 m/s speed-bar
  minSpeed: 24 / 3.6,        // ~6.7 m/s near stall
  sinkTrim: -1.1,            // m/s sink at trim
  sinkMax: -2.8,             // m/s sink at max speed
  sinkMin: -1.0,             // m/s best glide sink
  turnRate: 0.6,             // rad/s max turn rate
  bankMax: Math.PI / 4,      // 45° max bank
  pitchSens: 0.4,            // pitch control sensitivity
  rollDamp: 3.0,             // roll damping
  pitchDamp: 2.0,            // pitch damping
  launchAlt: 200,            // meters AGL at launch
  thermalStrength: 2.5,      // m/s max thermal lift
  thermalRadius: 120,        // meters thermal radius
};
