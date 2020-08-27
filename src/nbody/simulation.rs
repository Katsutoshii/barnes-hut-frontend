//! Simulation
use crate::nbody::bodies::{Body2D};

pub const NUM_PARTICLES: usize = 5;
pub const MIN_DIST: f32 = 12.;
pub const MIN_DIST_SQRD: f32 = MIN_DIST * MIN_DIST;
pub const WIDTH: u32 = 500;
pub const HEIGHT: u32 = 500;


// Create a static mutable byte buffer.
// We will use for passing memory between js and wasm.
// NOTE: global `static mut` means we will have "unsafe" code
// but for passing memory between js and wasm should be fine.
pub struct NBodySimulation2D {
    pub rx: Vec<f32>,
    pub ry: Vec<f32>,
    pub vx: Vec<f32>,
    pub vy: Vec<f32>,
    pub ax: Vec<f32>,
    pub ay: Vec<f32>,
    pub m: Vec<f32>,
    pub n: usize
}

pub static mut SIMULATION: NBodySimulation2D = NBodySimulation2D {
    rx: vec![],
    ry: vec![],
    vx: vec![],
    vy: vec![],
    ax: vec![],
    ay: vec![],
    m: vec![],
    n: NUM_PARTICLES,
};

impl NBodySimulation2D {
    pub fn set(&mut self, i: usize, body: &Body2D) {
        // self.m[i] = body.m;
        // self.rx[i] = body.rx;
        // self.ry[i] = body.ry;
        // self.vx[i] = body.vx;
        // self.vy[i] = body.vy;
        // self.ax[i] = 0.;
        // self.ay[i] = 0.;
    }

    pub fn integrate(&mut self, dt: f32) {
        // Integrate over time
        for i in 0..self.n {
            // println!("a = ({}, {})", self.ax[i], self.ay[i]);

            // Update velocities
            self.vx[i] += self.ax[i] * dt;
            self.vy[i] += self.ay[i] * dt;

            // Update acceleration
            self.rx[i] += self.vx[i] * dt;
            self.ry[i] += self.vy[i] * dt;
        }
    }
}