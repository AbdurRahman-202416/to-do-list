// Select necessary elements
const nameInput = document.getElementById("task-input");
const addCategoryButton = document.getElementById("add-task");
const outputList = document.querySelector(".output-f");
const taskCount = document.querySelector(".task-count");
const completedCount = document.querySelector(".completed-count");

// Function to fetch and display categories from the API
async function fetchCategories() {
  try {
    const response = await fetch('https://nest-todo-production-1ea6.up.railway.app/categories');
    const categories = await response.json();

    console.log('Categories fetched:', categories);
    // Pass categories to render function 
    renderCategories(categories);


  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}


// Function to render categories in the UI
const renderCategories = (categories) => {
  outputList.innerHTML = ''; // Clear previous output

  categories.forEach(categoryItem => {
    const taskElement = document.createElement('div');
    taskElement.className = 'output-list';

    // Check if tasks exist and provide a default empty array if undefined
    const tasks = categoryItem.tasks || [];
    const completedTasks = tasks.filter(task => task.completed).length;

    taskElement.innerHTML = `
      <h3 class="cout-text" style="color: #4ea8de">
        <a class="link-page" href="to-do.html?id=${categoryItem.id}">
          ${categoryItem.id}. ${categoryItem.name} <span class="task-count">${tasks.length}</span>
        </a>
      </h3>
      <h3 class="cout-text" style="color: rgba(130, 132, 250, 1)">
        Concluídas <span class="completed-count">${completedTasks}</span>
      </h3>
    `;
    
    outputList.appendChild(taskElement);
  });

  // taskCount.textContent = categories.length; // Update task count
};

// Function to add a new category using the API
async function addCategory(categoryName) {
  try {
    const response = await fetch('https://nest-todo-production-1ea6.up.railway.app/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: categoryName })
    });

    const data = await response.json();
    console.log('Category added:', data);

    fetchCategories(); // Refresh the categories after adding
  } catch (error) {
    console.error('Error adding category:', error);
  }
}

// Event listener for the "Add Category" button
addCategoryButton.addEventListener('click', () => {
  const categoryName = nameInput.value.trim(); // Get input value

  if (categoryName) {
    addCategory(categoryName); // Call function to add category
    nameInput.value = ''; // Clear input field
  } else {
    alert('Please enter a category name.');
  }
});

// Optional: Allow pressing Enter to add a category
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const categoryName = nameInput.value.trim();
    if (categoryName) {
      addCategory(categoryName);
      nameInput.value = '';
    } else {
      alert('Please enter a category name.');
    }
  }
});

// Load and display categories on page load
window.addEventListener('DOMContentLoaded', fetchCategories);
