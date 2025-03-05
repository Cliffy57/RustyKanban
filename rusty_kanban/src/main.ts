import { invoke } from "@tauri-apps/api/core";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}
async function submitTask() {
   // Retrieve the task input element value and add it to the TODO task list
    const taskInputEl = document.querySelector("#task-input") as HTMLInputElement;
    const taskListEl = document.querySelector("#todo-tasks") as HTMLUListElement;
    const task = taskInputEl.value;
    const taskItemEl = document.createElement("li");
    taskItemEl.textContent = task;
    taskListEl.appendChild(taskItemEl);
    taskInputEl.value = task;
    // Clear the input field
    taskInputEl.value = "";
    // no bullet points
    taskItemEl.style.listStyleType = "none";
    // center the text inside the parent ul element
    taskItemEl.style.textAlign = "center";
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
  document.querySelector("#task-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    submitTask();
    console.log("Task submitted");
  }
  );
});
