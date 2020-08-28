use js_sys::WebAssembly;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;

pub mod nbody;

use nbody::{SIMULATION, NUM_PARTICLES, generate_galaxy, nbody_direct_2d};

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn get_wasm_memory() -> Result<JsValue, JsValue> {
    match wasm_bindgen::memory().dyn_into::<WebAssembly::Memory>() {
        Ok(memory) => Ok(memory.buffer()),
        Err(_) => Err(JsValue::from_str("Could not get memory")),
    }
}

/// Bind the pointers from javascript (ptr to 7 (arrays) * MAX_PARTICLES * 4 bytes of memory)
fn bind_sim(
        rx: &mut [f32],
        ry: &mut [f32],
        vx: &mut [f32],
        vy: &mut [f32],
        ax: &mut [f32],
        ay: &mut [f32],
        m: &mut [f32]) {
    unsafe {
        SIMULATION.rx = Vec::from_raw_parts(rx.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        SIMULATION.ry = Vec::from_raw_parts(ry.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        SIMULATION.vx = Vec::from_raw_parts(vx.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        SIMULATION.vy = Vec::from_raw_parts(vy.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        SIMULATION.ax = Vec::from_raw_parts(ax.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        SIMULATION.ay = Vec::from_raw_parts(ay.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        SIMULATION.m = Vec::from_raw_parts(m.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
    }
}

/// Initializes the simulation.
/// Binds JS array pointer to simulation, then runs `generate_galaxy`.
#[wasm_bindgen]
pub fn init_simulation(
        rx: &mut [f32],
        ry: &mut [f32],
        vx: &mut [f32],
        vy: &mut [f32],
        ax: &mut [f32],
        ay: &mut [f32],
        m: &mut [f32]) {
    unsafe {
        bind_sim(rx, ry, vx, vy, ax, ay, m);
        generate_galaxy(&mut SIMULATION);
    }
}

/// Runs a timestep of the simulation
#[wasm_bindgen]
pub fn run_timestep(
    rx: &mut [f32],
    ry: &mut [f32],
    vx: &mut [f32],
    vy: &mut [f32],
    ax: &mut [f32],
    ay: &mut [f32],
    m: &mut [f32]
) {
    unsafe {
        bind_sim(rx, ry, vx, vy, ax, ay, m);
        nbody_direct_2d(&mut SIMULATION, 0.1)
    }
}

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();
    

    // Your code goes here!
    console::log_1(&JsValue::from_str("Bye world!"));
    Ok(())
}
