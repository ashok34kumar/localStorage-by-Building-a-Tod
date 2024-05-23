// Get DOM elements by their IDs
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Retrieve tasks from local storage or initialize an empty array
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};// Object to keep track of the current task being edited
// Function to add a new task or update an existing task
const addOrUpdateTask = () => {
      // Find the index of the task to update, if it exists
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {  // Create a new task object
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };
 // If task is new, add it to the beginning of the taskData array
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else { // If task exists, update it in the taskData array
    taskData[dataArrIndex] = taskObj;
  }
// Save updated taskData array to local storage
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer()// Update the task container and reset the form
  reset()
};
// Function to update the tasks displayed in the UI
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";
 // Add each task from taskData to the tasksContainer
  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `)
    }
  );
};

// Function to delete a task
const deleteTask = (buttonEl) => {
    // Find the index of the task to delete
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
// Remove task from the DOM
  buttonEl.parentElement.remove();
  // Remove task from taskData array
  taskData.splice(dataArrIndex, 1);
  // Save updated taskData array to local storage
  localStorage.setItem("data", JSON.stringify(taskData));
}

// Function to edit a task
const editTask = (buttonEl) => {
    // Find the index of the task to edit
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
 // Set the currentTask to the task being edited
  currentTask = taskData[dataArrIndex];
// Populate form inputs with the task's current values
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;
 // Change form button text to "Update Task"
  addOrUpdateTaskBtn.innerText = "Update Task";
  // Show the task form
  taskForm.classList.toggle("hidden");  
}
// Function to reset the form
const reset = () => {
    // Reset form button text to "Add Task"
    addOrUpdateTaskBtn.innerText = "Add Task";
     // Clear form input fields
    titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
   // Hide the task form
  taskForm.classList.toggle("hidden");
   // Reset currentTask
  currentTask = {};
}
// If there are tasks in taskData, update the task container on page load

if (taskData.length) {
  updateTaskContainer();
}
// Event listener to open the task form

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);
// Event listener to handle closing the task form

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;
  // Show confirmation dialog if there are unsaved changes

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
        // Otherwise, just reset the form

    reset();
  }
});
// Event listener for cancel button in confirmation dialog

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});
// Event listener for form submission

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Add or update the task

  addOrUpdateTask();
});