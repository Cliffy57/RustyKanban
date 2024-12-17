import { invoke } from "@tauri-apps/api/core";

declare global {
  interface Window {
    __TAURI__?: any;
  }
}

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

/**
 * Asynchronously invokes the "greet" command with the value from the input element
 * and sets the resulting message to the message element.
 */
async function greet() {
  if (greetMsgEl && greetInputEl) {
    const name = greetInputEl.value;
    if (window.__TAURI__) {
      // Running in Tauri environment
      greetMsgEl.textContent = await invoke("greet", { name });
    } else {
      // Running in browser environment
      greetMsgEl.textContent = `Hello, ${name}!`;
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
