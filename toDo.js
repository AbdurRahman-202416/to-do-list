// Extracting category id from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

// Load categories from localStorage or start with an empty array
let categories = JSON.parse(localStorage.getItem("categories")) || [];

// Find the selected category by id
// console.log(categories)
const selectedCategory = categories.filter(cat => cat.id === Number(id));
console.log("Category ID from URL:", selectedCategory);


// Display category name

console.log("Categories in Local Storage:", categories);

// Task count will update dynamically
const taskCount = document.getElementById('task-count');
const completedCountDisplay = document.getElementById('completed-count');

// Elements for input and task output
let input = document.getElementById('task-input');
let outputBox = document.getElementById('task-list');
let btn = document.getElementById('add-task');

// Load tasks from localStorage or start with an empty array
let tasks = JSON.parse(localStorage.getItem(`tasks_${id}`)) || [];

if (selectedCategory) {
    
    const groupName = document.getElementById('created-tasks-header');
    if (groupName) {
        groupName.innerText = `${selectedCategory[0].name} ${tasks.length}` || "Category Not Found";
        
    } else {
        console.error("Element with ID 'created-tasks-header' not found.");
    }
} else {
    console.error("No category found for this ID.");
}

// Function to render tasks
function renderTasks() {
    outputBox.innerHTML = ''; // Clear previous tasks
    let completedCount = 0; // Track completed tasks

    tasks.forEach((task, index) => {
        // Increment completed count if task is completed
        if (task.completed) completedCount++;

        const taskItem = `
            <div class="task-item" id="task-item-${index}">
                <input type="checkbox" id="task-${index}" class="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTaskCompletion(${index})" />
                <label for="task-${index}">${task.completed ? `<strike>${task.name}</strike>` : task.name}</label>
                <img src="img/Layer 1.png" alt="delete" class="trash-icon" id="delete-icon-${index}" onclick="deleteTask(${index})" />
            </div>
        `;
        outputBox.insertAdjacentHTML('beforeend', taskItem);
    });

    // Update task count and completed tasks count
    taskCount.innerText = tasks.length;
    completedCountDisplay.innerText = `${completedCount} of ${tasks.length}`;
}

// Function to add a task
btn.addEventListener('click', () => {
    const taskName = input.value.trim();
    if (taskName !== "") {
        
        const newTask = {
            id: Date.now(), // Unique ID for each task
            name: taskName,
            completed: false
        };
        tasks.push(newTask); // Add new task to the array
        localStorage.setItem(`tasks_${id}`, JSON.stringify(tasks)); // Save to localStorage
        input.value = ''; // Clear input field
        renderTasks(); // Re-render task list
    }
    location.reload();
});

// Function to delete a task
function deleteTask(taskIndex) {
    tasks.splice(taskIndex, 1); // Remove the task from the array
    localStorage.setItem(`tasks_${id}`, JSON.stringify(tasks)); // Update localStorage
    renderTasks(); // Re-render task list
    location.reload();
}

// Function to toggle task completion
function toggleTaskCompletion(taskIndex) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed; // Toggle completed state
    localStorage.setItem(`tasks_${id}`, JSON.stringify(tasks)); // Update localStorage
    renderTasks(); // Re-render task list
}

// Initially render tasks when the page loads
renderTasks();
