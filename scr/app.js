//IMPORTING TASK AND STORAGE
import {Task} from "./task.js";
import {saveTasks, getTasks} from "./storage.js";

// const userOne = new Task ("Complete today's task", "You can do it");
// console.log(userOne);


//DECLARING THE VARIABLE
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
let tasks = getTasks();


//UPDATE THE TASK BY RENDERING
const renderTask = (task) => {
  const li = document.createElement("li");
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.innerHTML = `
    <span>${task.title} ${task.quote ? `<em>(${task.quote})</em>` : ''}</span>
    <div>
      <button class="edit-btn" data-id="${task.id}">Edit</button>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    </div>
  `;
  taskList.appendChild(li);
};



//FILTER
const filterButtons = document.querySelectorAll("#filter-buttons button");
let currentFilter = "all";
const renderTasks = () => {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    });
    filteredTasks.forEach(renderTask);
  };
  
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderTasks();
    });
  });



//SUBMIT EVENT HANDLER
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const quote = document.getElementById("task-quote").value;
  const task = new Task(title, quote);
  tasks.push(task);
  saveTasks(tasks);
  renderTasks();
  taskForm.reset();
});
renderTasks();

//API
const fetchQuoteBtn = document.getElementById("fetch-quote");
const taskQuoteInput = document.getElementById("task-quote");

const fetchQuote = async () => {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const { content } = await response.json();
    taskQuoteInput.value = content;
  } catch (e) {
    console.error("Error fetching quote:", e);
    console.log(e.response);
    taskQuoteInput.value = "Failed to fetch quote";
  }
};


fetchQuoteBtn.addEventListener("click", fetchQuote);

//EDIT AND DELETE EVENTS
taskList.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("delete-btn")) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks(tasks);
      renderTasks();
    } else if (e.target.classList.contains('edit-btn')) {
      const newTitle = prompt("Enter new title:");
      if (newTitle) {
        tasks = tasks.map((task) =>
          task.id === id ? { ...task, title: newTitle } : task
        );
        saveTasks(tasks);
        renderTasks();
      }
    }
  });