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
  taskItemEl.classList.add("task");
  // Clear the input field
  taskInputEl.value = "";
  // no bullet points
  taskItemEl.style.listStyleType = "none";
  // center the text inside the parent ul element
  taskItemEl.style.textAlign = "center";
  // put it as editable
  taskItemEl.contentEditable = "true";
  invoke("submitTask", { name: task });
}

async function update_task(taskId: string, newText: string) {
  invoke("update_task", { taskId, newText });
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#task-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    submitTask();
    console.log("Task submitted");
  });
  const taskElement = document.querySelector("#task");
  if (taskElement) {
    // Add event listener to detect changes in value within the focused element
    const inputHandler = () => {
      const target = taskElement as HTMLElement;
      if (target.classList.contains("task")) {
        // Check that target is an li element with text content
        if (
          target.tagName === "LI" &&
          target.textContent?.trim() !== "" &&
          target.textContent
        ) {
          update_task(target.id, target.textContent);
        } else {
          console.log(
            "Error: Target is not an LI element or does not have text content."
          );
        }
      }
    };

    // Add focusout event listener to capture changes when the element loses focus
    taskElement.addEventListener("focusout", inputHandler);

    // Optionally, add input event listeners for immediate updates on user input (optional)
    if (taskElement instanceof HTMLElement && taskElement.tagName === "LI") {
      taskElement.childNodes.forEach((child) => {
        if (
          child instanceof HTMLElement &&
          child.classList.contains("editable-text")
        ) {
          child.addEventListener("input", inputHandler);
        }
      });
    }
  } else {
    console.log("Error: No element found with the ID #task.");
  }
});
