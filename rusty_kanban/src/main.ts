import { invoke } from "@tauri-apps/api/core";

async function submitTask() {
  const taskInputEl = document.querySelector("#task-input") as HTMLInputElement;
  const taskListEl = document.querySelector("#todo-tasks") as HTMLUListElement;
  const task = taskInputEl.value;
  const taskItemEl = document.createElement("li");
  
  // Make task editable
  taskItemEl.contentEditable = "true";
  taskItemEl.textContent = task;
  taskItemEl.classList.add("task");
  taskItemEl.dataset.taskId = Date.now().toString(); // Add unique ID
  
  // Add edit event listener
  taskItemEl.addEventListener("blur", async () => {
    const newText = taskItemEl.textContent || "";
    const taskId = taskItemEl.dataset.taskId || "";
    console.log(`Task ${taskId} edited: ${newText}`); // Browser console log
    await update_task(taskId, newText); // Send to Rust backend
  });
  
  // Add keypress event for Enter key
  taskItemEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      taskItemEl.blur();
    }
  });

  taskListEl.appendChild(taskItemEl);
  taskInputEl.value = "";
  taskItemEl.style.listStyleType = "none";
  taskItemEl.style.textAlign = "center";
  
  await invoke("submitTask", { name: task });
}

async function update_task(taskId: string, newText: string) {
  try {
    await invoke("update_task", { id: taskId, text: newText });
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#task-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    submitTask();
  });
});
