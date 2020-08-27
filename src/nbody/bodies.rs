//! Definitions for body structs
use std::fmt::Debug;

#[derive(Debug)]
pub struct BodyPosition2D {
    pub m: Vec<f32>,
    pub rx: Vec<f32>,
    pub ry: Vec<f32>,
}

#[derive(Debug)]
pub struct Body2D {
    pub m: f32,
    pub rx: f32,
    pub ry: f32,
    pub vx: f32,
    pub vy: f32,
}