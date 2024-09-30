// Extracting category id from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

function getCategories() {
  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  return categories;
}

function getSelectedCategory() {
  let categories = getCategories();
  const selectedCategory = categories.find((cat) => cat.id === Number(id));
  return selectedCategory;
}

// Task count will update dynamically
const taskCount = document.getElementById("task-count");
const completedCountDisplay = document.getElementById("completed-count");

// Elements for input and task output
let input = document.getElementById("task-input");
let outputBox = document.getElementById("task-list");
let btn = document.getElementById("add-task");

function renderCounts() {
  let selectedCategory = getSelectedCategory();
  console.log({ selectedCategory });
  if (selectedCategory) {
    const groupName = document.getElementById("created-tasks-header");
    if (groupName) {
      groupName.innerText =
        `${selectedCategory.name} ${selectedCategory.tasks.length}` ||
        "Category Not Found";
    } else {
      console.error("Element with ID 'created-tasks-header' not found.");
    }
  } else {
    console.error("No category found for this ID.");
  }
}

renderCounts();

// Function to render tasks
function renderTasks() {
  outputBox.innerHTML = ""; // Clear previous tasks
  let completedCount = 0; // Track completed tasks
  let selectedCategory = getSelectedCategory();
  selectedCategory.tasks.forEach((task, index) => {
    // Increment completed count if task is completed
    if (task.completed) completedCount++;

    const taskItem = `
            <div class="task-item" id="task-item-${index}">
                <input type="checkbox" id="task-${index}" class="checkbox" ${
      task.completed ? "checked" : ""
    } 
                       onchange="toggleTaskCompletion(${index})" />
                <label for="task-${index}">${
      task.completed ? `<strike>${task.name}</strike>` : task.name
    }</label>
                <img src="img/Layer 1.png" alt="delete" class="trash-icon" id="delete-icon-${index}" onclick="deleteTask(${index})" />
            </div>
        `;
    outputBox.insertAdjacentHTML("beforeend", taskItem);
  });

  // Update task count and completed tasks count
  taskCount.innerText = selectedCategory.tasks.length;
  completedCountDisplay.innerText = `${completedCount} of ${selectedCategory.tasks.length}`;
}

function saveTask(changedCategory) {
  let categories = getCategories();
  let changedCategories = categories.map((cat) => {
    if (cat.id == changedCategory.id) {
      cat = changedCategory;
    }
    return cat;
  });

  localStorage.setItem(`categories`, JSON.stringify(changedCategories)); // Save to localStorage
}

// Function to add a task
btn.addEventListener("click", () => {
  const taskName = input.value.trim();
  if (taskName !== "") {
    const newTask = {
      id: Date.now(), // Unique ID for each task
      name: taskName,
      completed: false,
    };

    let categories = getCategories();
    let selectedCategory = getSelectedCategory();

    selectedCategory.tasks.push(newTask);
    saveTask(selectedCategory);
    input.value = ""; // Clear input field
    renderTasks(); // Re-render task list
    renderCounts();
  }
});

// Function to delete a task
function deleteTask(taskIndex) {
  const selectedCategory = getSelectedCategory();
  selectedCategory.tasks.splice(taskIndex, 1); // Remove the task from the array
  saveTask(selectedCategory);
  renderTasks(); // Re-render task list
  renderCounts();
}

// Function to toggle task completion
function toggleTaskCompletion(taskIndex) {
  const selectedCategory = getSelectedCategory();
  selectedCategory.tasks[taskIndex].completed =
    !selectedCategory.tasks[taskIndex].completed;

  saveTask(selectedCategory);
  //save
  renderTasks(); // Re-render task list
  renderCounts();
}

// Initially render tasks when the page loads
renderTasks();
