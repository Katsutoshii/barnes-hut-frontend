export const clamp = (num, min, max) =>
  num <= min ? min : num >= max ? max : num;

export enum Optimization {
  BarnesHut,
  Direct,
}

// How many stars that will be simulated?
export const DEF_NUM_SIMULATE = 500;
// Below should equal MAX_PARTICLES from lib.rs
export const MAX_NUM_SIMULATE = 1000;
export const MAX_NUM_DIRECT_SIMULATE = 500;
export const MAX_NUM_BARNES_SIMULATE = MAX_NUM_SIMULATE;
// Other min / max for other controls
export const MIN_THETA = 0.1;
export const MAX_THETA = 3;
export const DEF_THETA = 1;
export const MIN_DT = 0.05;
export const MAX_DT = 25;
export const DEF_DT = 0.1;
// How many background stars, not a part of the simulation?
export const DEF_NUM_STARS = 300;
export const MAX_NUM_STARS = 1200;
export const DIMENSION = 3;
// Other controls
export const DEF_PAUSE = true;
export const DEF_OPTIMIZATION = Optimization.BarnesHut;
