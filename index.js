// Select necessary elements
const nameInput = document.getElementById("task-input");
const addCategoryButton = document.getElementById("add-task");
const outputList = document.querySelector(".output-box");
const taskCount = document.querySelector(".task-count");
const completedCount = document.querySelector(".completed-count");

// Load categories from localStorage or start with an empty array
let categories = JSON.parse(localStorage.getItem("categories")) || [];

// Function to add a new category
const addCategory = () => {
  const nameText = nameInput.value.trim();
  if (nameText === "") {
    alert("Enter task name");
    return;
  }

  const category = {
    id: categories.length + 1,
    name: nameText,
    tasks: [],
  };

  categories.push(category);
  nameInput.value = ""; // Clear the input field

  renderCategories();

  // Save categories to localStorage
  localStorage.setItem("categories", JSON.stringify(categories));
};

// Function to render categories
const renderCategories = () => {
  const outputBox = document.querySelector(".output-f");
  outputBox.innerHTML = ""; // Clear the output area

  categories.forEach((categoryItem, index) => {
    const taskElement = document.createElement("div");
    taskElement.className = "output-list";
    const completedTasks = categoryItem.tasks.filter(
      (task) => task.completed
    ).length;

    taskElement.innerHTML = `
  
     
        <h3 class="cout-text" style="color: #4ea8de">
          <a class="link-page" href="to-do.html?id=${categoryItem.id}">
            ${categoryItem.id}. ${categoryItem.name} <span class="task-count">${categoryItem.tasks.length}</span>
          </a>
        </h3>
        <h3 class="cout-text" style="color: rgba(130, 132, 250, 1)">
          Concluídas <span class="completed-count">${completedTasks}</span>
        </h3>
    
     
    `;

    outputBox.appendChild(taskElement);
  });
};

// Event listener for the add task button
addCategoryButton.addEventListener("click", addCategory);

// Optional: Allow pressing Enter to add a category
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addCategory();
  }
});

// Render the categories on page load
window.addEventListener("DOMContentLoaded", renderCategories);
