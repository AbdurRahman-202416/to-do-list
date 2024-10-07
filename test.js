// Extracting category id from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

console.log(id);


// Task count will update dynamically
const taskCount = document.getElementById("task-count");
const completedCountDisplay = document.getElementById("completed-count");

// Elements for input and task output
let input = document.getElementById("task-input");
let outputBox = document.getElementById("task-list");
let btn = document.getElementById("add-task");



const apiUrl =  'https://nest-todo-production-1ea6.up.railway.app'; 

const categoryId = id; // Using the `id` extracted from the URL

async function fetchCategories() {
  const response = await fetch(`${apiUrl}/categories`);
  return await response.JSON.parse;
}

async function fetchTasks() {
  const response = await fetch(`${apiUrl}/tasks`);
  return await response.json();
}

async function getSelectedCategory() {
    
  const categories = await fetchCategories(); 
console.log(categories[0]);

  return categories.find((cat) => cat.id === Number(categoryId));
   
}



async function renderTasks() {
    outputBox.innerHTML = ""; // Clear previous tasks
    let completedCount = 0; // Track completed tasks
    const selectedCategory = await getSelectedCategory();

    console.log("Selected Category:", selectedCategory); // Log the category

    if (!selectedCategory) {
        console.error("No category found for this ID.");
        return; // Exit if no category found
    }

    // Ensure tasks property exists
    if (!selectedCategory.tasks) {
        console.error("No tasks found in the selected category.");
        return; // Exit if no tasks found
    }

    selectedCategory.tasks.forEach((task, index) => {
        if (task.completed) completedCount++;

        const taskItem = `
        <div class="task-item" id="task-item-${index}">
            <input type="checkbox" id="task-${index}" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskCompletion(${task.id})" />
            <label for="task-${index}">${task.completed ? `<strike>${task.name}</strike>` : task.name}</label>
            <img src="img/Layer 1.png" alt="delete" class="trash-icon" id="delete-icon-${index}" onclick="deleteTask(${task.id})" />
        </div>`;

        outputBox.insertAdjacentHTML("beforeend", taskItem);
    });

    taskCount.innerText = selectedCategory.tasks.length;
    completedCountDisplay.innerText = `${completedCount} of ${selectedCategory.tasks.length}`;
}

async function addTask(taskName) {
  const newTask = {
    name: taskName,
    completed: false,
    categoryId: categoryId // Associate task with category
  };

  await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTask)
  });

  renderTasks();
  renderCounts();
}

async function deleteTask(taskId) {
  await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'DELETE'
  });
  renderTasks();
  renderCounts();
}

async function toggleTaskCompletion(taskId) {
  const task = await fetch(`${apiUrl}/tasks/${taskId}`);
  const taskData = await task.json();
  taskData.completed = !taskData.completed;

  await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  renderTasks();
  renderCounts();
}

// Event listener for adding a task
btn.addEventListener("click", async () => {
  const taskName = input.value.trim();
  if (taskName !== "") {
    await addTask(taskName);
    input.value = ""; // Clear input field
  }
});

// Initially render counts and tasks when the page loads
(async () => {
  await renderCounts();
  await renderTasks();
})();




async function renderCounts() {
    const selectedCategory = await getSelectedCategory();
  
    if (!selectedCategory) {
      console.error("No category found for this ID.");
      // Optionally handle this case in your UI, e.g., display a message to the user
      return;
    }
  
    const groupName = document.getElementById("created-tasks-header");
    if (groupName) {
      groupName.innerText = `${selectedCategory.name} (${selectedCategory.id.length})`;
    } else {
      console.error("Element with ID 'created-tasks-header' not found.");
    }
  }
    


