// toDo.js

// Select necessary elements
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const completedCount = document.getElementById('completed-count');

// Load tasks from localStorage on page load
window.onload = function() {
    loadTasks();
};

// Function to load tasks from localStorage
function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    taskList.innerHTML = '';  // Clear the task list before populating

    tasks.forEach((task, index) => {
        addTaskToDOM(task, index);
    });
    updateCounts();
}

// Get tasks from localStorage or return an empty array if none exist
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save tasks to localStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add task to the DOM
function addTaskToDOM(task, index) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.id = `task-item-${index}`;

    // Create checkbox and label
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index}`;
    checkbox.checked = task.completed;
    checkbox.className="checkbox";
    checkbox.addEventListener('change', function() {
        toggleTaskCompletion(index);
    });

    const label = document.createElement('label');
    label.setAttribute('for', `task-${index}`);
    label.innerHTML = task.completed ? `<strike>${task.text}</strike>` : task.text;

    // Delete button
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'img/Layer 1.png';
    deleteIcon.alt = 'delete';
    deleteIcon.classList.add('trash-icon');
    deleteIcon.addEventListener('click', function() {
        deleteTask(index);
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(label);
    taskItem.appendChild(deleteIcon);
    taskList.appendChild(taskItem);
}

// Toggle task completion status
function toggleTaskCompletion(index) {
    let tasks = getTasksFromLocalStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToLocalStorage(tasks);
    loadTasks();  // Reload tasks to update UI
}

// Delete a task
function deleteTask(index) {
    let tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);  // Remove task
    saveTasksToLocalStorage(tasks);
    loadTasks();  // Reload tasks to update UI
}

// Update task counts (total and completed)
function updateCounts() {
    let tasks = getTasksFromLocalStorage();
    let totalTasks = tasks.length;
    let completedTasks = tasks.filter(task => task.completed).length;

    taskCount.innerText = totalTasks;
    completedCount.innerText = `${completedTasks} de ${totalTasks}`;
}
