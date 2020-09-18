export const clamp = (num, min, max) =>
  num <= min ? min : num >= max ? max : num;

export enum Optimization {
  BarnesHut,
  Direct,
}

// How many stars that will be simulated?
export const DEF_NUM_SIMULATE = 500;
// Below should equal MAX_PARTICLES from lib.rs
export const MAX_NUM_SIMULATE = 10000;
export const MAX_NUM_DIRECT_SIMULATE = 5000;
export const MAX_NUM_BARNES_SIMULATE = 10000;
// How many background stars, not a part of the simulation?
export const DEF_NUM_STARS = 300;
export const MAX_NUM_STARS = 1200;
export const DIMENSION = 3;
// Other controls
export const DEF_PAUSE = true;
export const DEF_OPTIMIZATION = Optimization.BarnesHut;
