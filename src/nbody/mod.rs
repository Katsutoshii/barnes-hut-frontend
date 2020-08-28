pub mod bodies;
pub mod simulation;
pub mod generators;
pub mod direct;

pub use simulation::{SIMULATION, NUM_PARTICLES};
pub use generators::{generate_galaxy, maintain_bounds};
pub use direct::{nbody_direct_2d};
