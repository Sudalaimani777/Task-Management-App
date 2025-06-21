//IMPORTING THE STORAGE.JS AND TASK.JS FILES
import Task from './task.js';
import { saveTasks, getTasks } from './storage.js';

//QUOTE API configuration
const QuoteApi = "https://dummyjson.com/quotes/random";

// Select DOM elements
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const quoteInput = document.querySelector('#task-quote');
const fetchQuoteBtn = document.querySelector('#fetch-quote');
const filterButtons = document.querySelectorAll('#filter-buttons button');

// Store tasks in memory
let tasks = [];

// Function to create task element
function createTaskElement(task) {
    return `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <span class="task-title">${task.title}</span>
            ${task.quote ? `<span class="task-quote">"${task.quote}"</span>` : ''}
            <div class="task-actions">
                <button class="toggle-completed">${task.completed ? 'Undo' : 'Completed'}</button>
                <button class="edit-task">Edit</button>
                <button class="delete-task">Delete</button>
            </div>
        </li>
    `;
}

// Store current filter
let currentFilter = 'all';

// Function to render filtered tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    const filteredTasks = tasks.filter(task => {
        switch (currentFilter) {
            case 'completed':
                return task.completed;
            case 'pending':
                return !task.completed;
            default:
                return true;
        }
    });
    
    // Render filtered tasks
    filteredTasks.forEach(task => {
        taskList.innerHTML += createTaskElement(task);
    });
}

// Load tasks on page load
window.addEventListener('load', () => {
    tasks = getTasks();
    renderTasks();
});

// Handle form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const title = document.querySelector('#task-title').value;
    const quote = document.querySelector('#task-quote').value;
    
    // Create new task
    const newTask = new Task(title, quote);
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasks(tasks);
    
    // Render all tasks
    renderTasks();
    
    // Clear form
    taskForm.reset();
});

// Fetch a random quote from the API
async function fetchRandomQuote() {
    try {
        const response = await fetch(QuoteApi);
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        quoteInput.value = `"${data.quote}" - ${data.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteInput.value = 'Failed to fetch quote.Try again later.';
    }
}

// Add event listener for quote fetch button
fetchQuoteBtn.addEventListener('click', fetchRandomQuote);

// Add event listeners for filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update current filter
        currentFilter = button.dataset.filter;
        
        // Re-render tasks with new filter
        renderTasks();
    });
});

// Handle task actions
taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;

    // Handle delete
    if (target.classList.contains('delete-task')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);
        renderTasks();
    }
    
    // Handle edit
    if (target.classList.contains('edit-task')) {
        const newTitle = prompt('Enter new task title:', tasks[taskIndex].title);
        if (newTitle !== null) {
            tasks = tasks.map(task => 
                task.id === taskId ? { ...task, title: newTitle } : task
            );
            saveTasks(tasks);
            renderTasks();
        }
    }
    
    // Handle toggle completed from button or title click
    if (target.classList.contains('toggle-completed') || target.classList.contains('task-title')) {
        tasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks(tasks);
        renderTasks();
    }
});
