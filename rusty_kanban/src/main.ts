import { invoke } from "@tauri-apps/api/core";


let selectedTasks = new Set<HTMLElement>();
let lastSelectedTask: HTMLElement | null = null;
let activeMenu: HTMLElement | null = null;

async function submit_task() {
  const taskInputEl = document.querySelector("#task-input") as HTMLInputElement;
  const taskListEl = document.querySelector("#todo-tasks") as HTMLUListElement;
  const task = taskInputEl.value;
  const taskItemEl = document.createElement("li");
  
  taskItemEl.contentEditable = "true";
  taskItemEl.textContent = task;
  taskItemEl.classList.add("task");
  taskItemEl.dataset.taskId = Date.now().toString();
  
  // Add click handler for selection
  taskItemEl.addEventListener("click", (e) => handleTaskClick(e, taskItemEl));
  
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
  
  await invoke("submit_task", { name: task });
}

function handleTaskClick(e: MouseEvent, taskEl: HTMLElement) {
  if (e.shiftKey && lastSelectedTask) {
    // Clear previous selection
    clearTaskSelection();
    
    // Get all tasks between lastSelected and current
    const tasks = Array.from(document.querySelectorAll('.task'));
    const start = tasks.indexOf(lastSelectedTask);
    const end = tasks.indexOf(taskEl);
    const [lower, upper] = [Math.min(start, end), Math.max(start, end)];
    
    // Select all tasks in range
    tasks.slice(lower, upper + 1).forEach(task => {
      task.classList.add('selected');
      selectedTasks.add(task as HTMLElement);
    });
  } else if (e.ctrlKey || e.metaKey) {
    // Toggle single selection
    taskEl.classList.toggle('selected');
    if (taskEl.classList.contains('selected')) {
      selectedTasks.add(taskEl);
      lastSelectedTask = taskEl;
    } else {
      selectedTasks.delete(taskEl);
      lastSelectedTask = null;
    }
  } else {
    // Single selection
    clearTaskSelection();
    taskEl.classList.add('selected');
    selectedTasks.add(taskEl);
    lastSelectedTask = taskEl;
  }
}

function clearTaskSelection() {
  selectedTasks.forEach(task => task.classList.remove('selected'));
  selectedTasks.clear();
}

function handleContextMenu(e: MouseEvent) {
  e.preventDefault();
  
  // Remove any existing menu before creating a new one
  if (activeMenu) {
    activeMenu.remove();
  }
  
  const taskEl = e.currentTarget as HTMLElement;
  
  // If clicking on unselected task, select only this one
  if (!taskEl.classList.contains('selected')) {
    clearTaskSelection();
    taskEl.classList.add('selected');
    selectedTasks.add(taskEl);
  }
  
  // Get current column
  const currentColumn = taskEl.closest('ul')?.id.replace('-tasks', '');
  
  const menu = document.createElement('div');
  activeMenu = menu;  // Track the active menu
  menu.className = 'context-menu';
  menu.dataset.menuId = `menu-${Date.now()}`; // Add unique ID to menu
  menu.style.position = 'fixed';
  menu.style.left = `${e.pageX}px`;
  menu.style.top = `${e.pageY}px`;
  
  const options = [
    { text: 'Move to Todo', column: 'todo' },
    { text: 'Move to In Progress', column: 'in-progress' },
    { text: 'Move to Done', column: 'done' }
  ].filter(option => option.column !== currentColumn);
  
  options.forEach(({ text, column }) => {
    const option = document.createElement('div');
    option.className = 'menu-item';
    option.textContent = text;
    option.addEventListener('click', async () => {
      const targetList = document.querySelector(`#${column}-tasks`);
      if (targetList) {
        // Move all selected tasks
        selectedTasks.forEach(async (task) => {
          const taskId = task.dataset.taskId;
          if (taskId) {
            targetList.appendChild(task);
            await moveTask(taskId, column);
          }
        });
      }
      menu.remove();
      clearTaskSelection();
    });
    menu.appendChild(option);
  });
  
  document.body.appendChild(menu);
  
  // Only remove this specific menu when clicking outside
  window.addEventListener('click', (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      menu.remove();
      activeMenu = null;
    }
  }, { once: true });
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

function setupTutorial() {
  const helpButton = document.getElementById('help-button');
  const modal = document.getElementById('tutorial-modal');
  const closeButton = document.getElementById('close-tutorial');

  helpButton?.addEventListener('click', () => {
    if (modal) modal.style.display = 'block';
  });

  closeButton?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal && modal) {
      modal.style.display = 'none';
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#task-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    submit_task();
  });
  
  setupTutorial();
});
