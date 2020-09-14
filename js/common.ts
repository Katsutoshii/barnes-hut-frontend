export enum Optimization {
  BarnesHut,
  Regular,
}

// How many stars that will be simulated?
export const DEF_NUM_SIMULATE = 1000;
export const MAX_NUM_SIMULATE = 10000;
export const MAX_NUM_DIRECT_SIMULATE = 2000;
// How many background stars, not a part of the simulation?
export const DEF_NUM_STARS = 10000;
export const MAX_NUM_STARS = 500000;
export const DIMENSION = 3;
// Other controls
export const DEF_PAUSE = true;
export const DEF_OPTIMIZATION = Optimization.BarnesHut;
