pub mod bodies;
pub mod simulation;
pub mod generators;
pub mod direct;

pub use simulation::{SIMULATION, NUM_PARTICLES};
pub use generators::{generate_galaxy, maintain_bounds};
