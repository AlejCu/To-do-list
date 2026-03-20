// Variables getting the form and input fields to create tasks
const addToDoMenu = document.querySelector('form');
const addToDoInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const filterTypeSelect = document.getElementById('task-type');
const clearCompletedButton = document.getElementById('clear-completed');
const taskMainContainer = document.querySelector('ul');

let taskList = [];

// Function to generate the task list
function generateTaskList() {
    // Gets the value of the task type filter input to know which type of tasks to show in the list
    const typeOfFilter = document.getElementById('task-type').value;
    taskMainContainer.innerHTML = ''; // Clear the container before generating the list to avoid duplicates

    // Filtered list
    const filteredTaskList = taskList.filter(task => {
        // Shows all the tasks
        if (typeOfFilter === 'all') {
            return true;
        }
        // Shows only completed tasks
        if (typeOfFilter === 'completed') {
            return task.completed === true;
        }
        // Shows only pending tasks
        if (typeOfFilter === 'pending') {
            return task.completed === false;
        }
        return false;
    });

    // Generates a new li element for each task in the taskList array and appends it to the main container
    filteredTaskList.forEach(task => {
        const taskContainer = document.createElement('li');
        // Modify the html of each task if needed
        taskContainer.innerHTML = `
            <input type="checkbox" class="task-checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <span>${task.text} - Due: ${task.dueDate}</span>
            <button class="delete-button" data-id="${task.id}">Delete</button>
        `;
        taskMainContainer.appendChild(taskContainer);
    });
};

// Function to delete tasks
function deleteTask(taskId) {
    // Filters the taskList to remove the task with the matching id
    taskList = taskList.filter(task => task.id !== taskId);
    // Updates the task list and counters after deletion
    generateTaskList();
    updateTaskListCounter();
    updateCompletedTasksCounter();
    saveTasksToLocalStorage();
}

// Event listener for the delete buttons inside the "ul" element
taskMainContainer.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-button');

    // No action if the button clicked is not a delete button
    if (!deleteButton) return;

    // Gets the id from the list item from the closest button clicked on and uses that value to run the deleteTask function
    const taskIdValue = parseInt(deleteButton.getAttribute('data-id'));
    deleteTask(taskIdValue);
});

// Function to clear the filters
function clearFilters() {
    // Resets the values of all the filter options to show all tasks
    filterTypeSelect.value = 'all';
    document.getElementById('filter-fromDate').value = '';
    document.getElementById('filter-toDate').value = '';
    // Generates the task list again
    generateTaskList();
};

clearCompletedButton.addEventListener('click', clearFilters);

document.addEventListener('DOMContentLoaded', () => {
    const taskStorage = localStorage.getItem('tasks');

    if (taskStorage) {
        // If we have tasks in the local storage we convert the string back into an array to get assigned to the taskList variable and then it runs the generateTaskList function
        taskList = JSON.parse(taskStorage);
        generateTaskList();
        updateCompletedTasksCounter();
        updateTaskListCounter();
    }
});

// Listens to any changes on the select element for the task type filter and renders the list once again to show the updated information based on the selected filter
filterTypeSelect.addEventListener('change', () => {
    generateTaskList();
});

// Function to save the task list into the local storage as a string
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
};

// Function to update the total task counter based on the lenght of the taskList
function updateTaskListCounter() {
    const taskListCounter = document.getElementById('total-tasks');
    taskListCounter.textContent = taskList.length;
};

// Function to update the completed tasks counter based on the checkboxes for each task
function updateCompletedTasksCounter() {
    const completedTasksCounter = document.getElementById('completed-tasks');
    // Filters the taskList to only look for the tasks with the completed value
    const completedTasksList = taskList.filter(task => task.completed === true);
    // Changes the value for the completedTasksCounter to match the lenght of the list of completed tasks
    completedTasksCounter.textContent = completedTasksList.length;
};

// Event listener for every change made only on the checkbox elements with the class task-checkbox
document.addEventListener('change', (event) => {
    // Checks if the element contains the class
    if (event.target.classList.contains('task-checkbox')) {
        //
        let taskId = parseInt(event.target.id);
        const task = taskList.find(task => task.id === taskId);
        if (task) {
            task.completed = event.target.checked;
            updateCompletedTasksCounter();
            saveTasksToLocalStorage();
        }
    }
});

// Function to add a new task to the list
function addTask(event) {
    // Avoids reloading the page when the form is submitted
    event.preventDefault();
    // Gets the text and due date values from the form submission
    const taskText = addToDoInput.value;
    const dueDate = dueDateInput.value;
    // If there is text in the task input field, it creates a new task object with its values and pushes that to the taskList object, then it clears the input fields for the next task
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            dueDate: dueDate,
            completed: false
        };  
        taskList.push(newTask);
        addToDoInput.value = '';
        dueDateInput.value = '';
        // Runs the generateTaskList function to update the task list with the new task
        generateTaskList();
        updateTaskListCounter();
        // Runs the saveTasksToLocalStorage function to save the updated task list to local storage
        saveTasksToLocalStorage();
    }
};

// Looks for the submision event for the task form and runs the addTask function when the form is submitted
addToDoMenu.addEventListener('submit', addTask);