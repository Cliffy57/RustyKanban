import { invoke } from "@tauri-apps/api/core";

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
    invoke('submitTask' , {name: task});
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#task-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    submitTask();
    console.log("Task submitted");
  }
  );
});
