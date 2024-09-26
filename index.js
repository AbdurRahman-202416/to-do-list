// Select necessary elements
const nameInput = document.getElementById("task-input");
const addCactegoryButton = document.getElementById("add-task");
const outputList = document.querySelector(".output-box");
const taskCount = document.querySelector(".task-count");
const completedCount = document.querySelector(".completed-count");

//TODO: load categories from localstorage. if no data, then start with empty array.
let categories = [];
// let tasks = [];

// Function to add a new task
const addCategory = () => {
  const nameText = nameInput.value.trim();
  if (nameText === "") {
    alert("Enter task name ");
    return;
  } // Don't add empty tasks
  const category = {
    name: nameText,
    tasks: [],
  };
  categories.push(category);
  nameInput.value = ""; // Clear the input field

  renderCategories();
  //TODO: save categories to localStorage.
};

// Function to render tasks
const renderCategories = () => {
  const outputBox = document.querySelector(".output-f");
  outputBox.innerHTML = " ";


  categories.forEach((categoryItem, index) => {
    const taskElement = document.createElement("div");

    taskElement.innerHTML = ` <div class="output-list">
        <h3 class="cout-text" style="color: #4ea8de">
          ${categoryItem.name}<span class="task-count">${categoryItem.tasks.length}</span>
        </h3>
        <h3 class="cout-text" style="color: rgba(130, 132, 250, 1)">
          Concluídas <span class="completed-count">${categoryItem.tasks.length}</span>
        </h3>
        
      
    </div>
        `;
   
    outputBox.appendChild(taskElement);
  });
};

// Event listener for the add task button
addCactegoryButton.addEventListener("click", addCategory);

// Optional: Allow pressing Enter to add a task
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addCategory();
  }
});
