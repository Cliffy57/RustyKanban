
export {};

declare global {
  interface Window {
    __TAURI__?: any;
  }
}

interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
}

let tasks: Task[] = [];
let taskIdCounter = 0;

function renderBoard() {
  const todoColumn = document.querySelector("#todo-column");
  const inProgressColumn = document.querySelector("#in-progress-column");
  const doneColumn = document.querySelector("#done-column");

  if (todoColumn && inProgressColumn && doneColumn) {
    todoColumn.innerHTML = "";
    inProgressColumn.innerHTML = "";
    doneColumn.innerHTML = "";

    tasks.forEach(task => {
      const taskEl = document.createElement("div");
      taskEl.className = "task";
      taskEl.textContent = task.title;
      taskEl.draggable = true;
      taskEl.dataset.id = task.id.toString();
      taskEl.addEventListener("dragstart", handleDragStart);

      if (task.status === "todo") {
        todoColumn.appendChild(taskEl);
      } else if (task.status === "in-progress") {
        inProgressColumn.appendChild(taskEl);
      } else if (task.status === "done") {
        doneColumn.appendChild(taskEl);
      }
    });
  }
}

function addTask(title: string) {
  tasks.push({ id: taskIdCounter++, title, status: "todo" });
  renderBoard();
}

function moveTask(taskId: number, newStatus: "todo" | "in-progress" | "done") {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
    renderBoard();
  }
}

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer && event.target instanceof HTMLElement) {
    event.dataTransfer.setData("text/plain", event.target.dataset.id || "");
  }
}

function handleDrop(event: DragEvent, newStatus: "todo" | "in-progress" | "done") {
  event.preventDefault();
  const taskId = parseInt(event.dataTransfer?.getData("text/plain") || "", 10);
  moveTask(taskId, newStatus);
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#add-task-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.querySelector("#task-input") as HTMLInputElement;
    if (taskInput) {
      addTask(taskInput.value);
      taskInput.value = "";
    }
  });

  document.querySelector("#todo-column")?.addEventListener("drop", (e) => handleDrop(e as DragEvent, "todo"));
  document.querySelector("#in-progress-column")?.addEventListener("drop", (e) => handleDrop(e as DragEvent, "in-progress"));
  document.querySelector("#done-column")?.addEventListener("drop", (e) => handleDrop(e as DragEvent, "done"));

  document.querySelector("#todo-column")?.addEventListener("dragover", handleDragOver as EventListener);
  document.querySelector("#in-progress-column")?.addEventListener("dragover", handleDragOver as EventListener) ;
  document.querySelector("#done-column")?.addEventListener("dragover", handleDragOver as EventListener);

  renderBoard();
});
