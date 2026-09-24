(function () {
  const STORAGE_KEY = "tc-pages-demo:tasks";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const counter = document.getElementById("task-counter");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to load tasks from localStorage", err);
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  let tasks = loadTasks();

  function render() {
    const remaining = tasks.filter((task) => !task.completed).length;
    counter.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
    const hasCompleted = tasks.some((task) => task.completed);
    clearCompletedBtn.disabled = !hasCompleted;
    list.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.type = "button";
      deleteBtn.textContent = "✕";
      deleteBtn.setAttribute("aria-label", "Delete task");
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

    emptyState.classList.toggle("hidden", tasks.length > 0);
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    tasks.push({ id: createId(), text: trimmed, completed: false });
    saveTasks(tasks);
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(tasks);
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks(tasks);
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks(tasks);
    render();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(input.value);
    input.value = "";
    input.focus();
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  render();
})();
