const LocalStorage = 'tasks';

// Save tasks to localStorage
export function saveTasks(tasks) {
    localStorage.setItem(LocalStorage, JSON.stringify(tasks));
}

// Get tasks from localStorage
export function getTasks() {
    const tasks = localStorage.getItem(LocalStorage);
    return tasks ? JSON.parse(tasks) : [];
}

// Clear all tasks from localStorage
export function clearTasks() {
    localStorage.removeItem(LocalStorage);
}
