import { invoke } from "@tauri-apps/api/core";

interface Task {
  id: string;
  text: string;
  column: 'todo' | 'in-progress' | 'done';
}

async function submitTask() {
  const taskInputEl = document.querySelector("#task-input") as HTMLInputElement;
  const taskListEl = document.querySelector("#todo-tasks") as HTMLUListElement;
  const task = taskInputEl.value;
  const taskItemEl = document.createElement("li");
  
  taskItemEl.contentEditable = "true";
  taskItemEl.textContent = task;
  taskItemEl.classList.add("task");
  taskItemEl.dataset.taskId = Date.now().toString();
  
  // Add context menu event
  taskItemEl.addEventListener("contextmenu", handleContextMenu);
  
  // Add edit event listener
  taskItemEl.addEventListener("blur", async () => {
    const newText = taskItemEl.textContent || "";
    const taskId = taskItemEl.dataset.taskId || "";
    console.log(`Task ${taskId} edited: ${newText}`);
    await update_task(taskId, newText);
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

function handleContextMenu(e: MouseEvent) {
  e.preventDefault();
  
  // Remove any existing context menus
  document.querySelectorAll('.context-menu').forEach(menu => menu.remove());
  
  const taskEl = e.currentTarget as HTMLElement;
  const taskId = taskEl.dataset.taskId;
  
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.position = 'fixed';
  menu.style.left = `${e.pageX}px`;
  menu.style.top = `${e.pageY}px`;
  
  const options = [
    { text: 'Move to Todo', column: 'todo' },
    { text: 'Move to In Progress', column: 'in-progress' },
    { text: 'Move to Done', column: 'done' }
  ];
  
  options.forEach(({ text, column }) => {
    const option = document.createElement('div');
    option.className = 'menu-item';
    option.textContent = text;
    option.addEventListener('click', async () => {
      const targetList = document.querySelector(`#${column}-tasks`);
      if (targetList && taskId) {
        targetList.appendChild(taskEl);
        await moveTask(taskId, column);
      }
      menu.remove();
    });
    menu.appendChild(option);
  });
  
  document.body.appendChild(menu);
  
  // Close menu when clicking outside
  window.addEventListener('click', () => menu.remove(), { once: true });
}

async function moveTask(taskId: string, newColumn: string) {
  try {
    await invoke("move_task", { id: taskId, column: newColumn });
    console.log(`Task ${taskId} moved to ${newColumn}`);
  } catch (error) {
    console.error("Error moving task:", error);
  }
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
