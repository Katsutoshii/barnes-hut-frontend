use js_sys::WebAssembly;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;

// Create a static mutable byte buffer.
// We will use for passing memory between js and wasm.
// NOTE: global `static mut` means we will have "unsafe" code
// but for passing memory between js and wasm should be fine.
pub const WASM_MEMORY_BUFFER_SIZE: usize = 4;
static mut WASM_MEMORY_BUFFER: [u8; WASM_MEMORY_BUFFER_SIZE] = [0, 2, 3, 2];

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

// Function to return a pointer to our array in our wasm memory buffer
#[wasm_bindgen]
pub fn get_wasm_memory_buffer_pointer() -> *const u8 {
    let pointer: *const u8;
    unsafe {
        pointer = WASM_MEMORY_BUFFER.as_ptr();
    }

    return pointer;
}

// Function to return a pointer to our array in our wasm memory buffer
#[wasm_bindgen]
pub fn get_wasm_buffer_size() -> usize {
    return WASM_MEMORY_BUFFER_SIZE;
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
