// @ts-nocheck
// Extracting category ID from URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id"); // This is the category ID from the URL
console.log(id);
const taskCount = document.getElementById("task-count");

const categoriesName=document.getElementById("cat-name");
async function FetchAllCategories() {
  try {
    const response = await fetch(
     `https://nest-todo-production-1ea6.up.railway.app/categories/${id}`
    );
    let categories = await response.json();
        categoriesName.innerText=categories.name;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
FetchAllCategories();

// Task count will update

const completedCountDisplay = document.getElementById("completed-count");

// Elements for input and task output
let input = document.getElementById("task-input");
let outputBox = document.getElementById("task-list");
let btn = document.getElementById("add-task");
let alltasks = [];
const tasksApiUrl = "https://nest-todo-production-1ea6.up.railway.app/tasks";

//get all task under selected categories id .....
async function fetchTask() {
  try {
    const response = await fetch(
      `https://nest-todo-production-1ea6.up.railway.app/tasks/category/${id}`
    );
    console.log({ response });
    if (response.status == 200) {
      const tasks = await response.json();

      alltasks = tasks;
      console.log({ tasks });
      renderTasks(tasks);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
fetchTask();

//    function getTask() {
//   fetch(`https://nest-todo-production-1ea6.up.railway.app/tasks/category/${id}`)
//     .then((response) => response.json())
//     .then((data) =>{
//       renderTasks(data);
//       console.log(data);
//     })
//     .catch((error) => console.error("Error:", error));
// }
// getTask();

// Render tasks for the selected category
function renderTasks(tasks) {
  //FIND OUT COUNTS
  let completedCount = 0;
  let totalCount = tasks.length;
  completedCount=tasks.reduce((sum, currentValue)=>{
    if(currentValue.isCompleted== true){
      return sum+1;
    }
    else{
      return sum;
    }
  },0);

  completedCountDisplay.innerHTML = `${completedCount} of ${totalCount}`;
  taskCount.innerHTML = totalCount;

  outputBox.innerHTML = ""; // Clear previous tasks
  tasks.forEach((task, index) => {
    const taskItem = `
<div class="task-item" id="task-item-${index}">
    <input type="checkbox" id="task-${index}" class="checkbox" ${
      task.isCompleted ? "checked" : ""
    } onchange="toggleTaskCompletion(${task.id})" />
    <label for="task-${index}">${
      task.isCompleted ? `<strike>${task.name}</strike>` : task.name
    }</label>
    <img src="img/Layer 1.png" alt="delete" class="trash-icon" id="delete-icon-${index}" onclick="deleteTask(${
      task.id
    })" />
</div>`;
    outputBox.insertAdjacentHTML("beforeend", taskItem);
  });
}

// Add task event listener
btn.addEventListener("click", async () => {
  const taskName = input.value.trim();
  if (taskName !== "") {
    const newTask = {
      name: taskName,
      description: " defult  Null Value ",
      isCompleted: false,
      categoryId: id,
    };

    await postTask(newTask);
    fetchTask();
  }
});

//post method ,data post
async function postTask(task) {
  try {
    const response = await fetch(
      `https://nest-todo-production-1ea6.up.railway.app/tasks`,
      {
        method: "POST",
        body: JSON.stringify(task),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Promise.reject(error);
  }
}

// Toggle task completion status
async function toggleTaskCompletion(taskId) {
  const task = alltasks.find(function (value, index) {
    if (value.id == taskId) {
      return true;
    } else {
      return false;
    }
  });
  console.log(task.isCompleted);
  if (task.isCompleted == false) {
    task.isCompleted = true;
    console.log("changed to true");
  } else {
    task.isCompleted = false;
    console.log("changed to false");
  }

  await PatchTask(task);
  fetchTask();
}

async function PatchTask(task) {
  const taskID = task.id;

  try {
    const response = await fetch(
      `https://nest-todo-production-1ea6.up.railway.app/tasks/${taskID}`,
      {
        method: "PATCH",
        body: JSON.stringify(task),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Promise.reject(error);
  }
}

async function deleteTaskss(taskId) {
  try {
    const response = await fetch(
      `https://nest-todo-production-1ea6.up.railway.app/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Promise.reject(error);
  }
}

async function deleteTask(taskIndex) {
  await deleteTaskss(taskIndex);

  fetchTask();
  // Remove the task from the array
}

//0.GET and RENDER all TASKS under current categoryID
//1.CREATE Task under current categoryID, and refetch all tasks.
