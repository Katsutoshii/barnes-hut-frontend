use js_sys::WebAssembly;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;

pub mod nbody;

use nbody::{SIMULATION, NUM_PARTICLES, generate_galaxy};

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Function to return wasm memory buffer
#[wasm_bindgen]
pub fn get_wasm_memory() -> Result<JsValue, JsValue> {
    match wasm_bindgen::memory().dyn_into::<WebAssembly::Memory>() {
        Ok(memory) => Ok(memory.buffer()),
        Err(_) => Err(JsValue::from_str("Could not get memory")),
    }
}

// Function to return a pointer to X_POSITIONS
#[wasm_bindgen]
pub fn set_rx(rx: &mut [f32]) {
    unsafe {
        SIMULATION.rx = Vec::from_raw_parts(rx.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        for i in 0..SIMULATION.n {
            SIMULATION.rx[i] = 1.;
        }
    }
}

// Function to return a pointer to X_POSITIONS
#[wasm_bindgen]
pub fn set_ry(ry: &mut [f32]) {
    unsafe {
        SIMULATION.ry = Vec::from_raw_parts(ry.as_mut_ptr(), NUM_PARTICLES, NUM_PARTICLES);
        for i in 0..SIMULATION.n {
            SIMULATION.ry[i] = 1.;
        }
    }
}

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();
    // unsafe {
    //     generate_galaxy(&mut SIMULATION);
    // }

    // Your code goes here!
    console::log_1(&JsValue::from_str("Bye world!"));
    Ok(())
}
