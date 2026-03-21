// Variables getting the form and input fields to create tasks
const addToDoMenu = document.querySelector('form');
const addToDoInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const colorInput = document.getElementById('color-input');
const filterTypeSelect = document.getElementById('task-type');
const colorFilterSelect = document.getElementById('filter-color');
const clearCompletedButton = document.getElementById('clear-completed');
const taskMainContainer = document.querySelector('ul');

// Task list variable
let taskList = [];

// Task color selection variable
const taskColor = {
    red: '#ff595e',
    yellow: '#ffca3a',
    green: '#8ac926',
    blue: '#1982c4',
    purple: '#6a4c93',
    pink: '#ff69b4',
}

// Ok ahora lo que nos falta es el select de si es un issue de prioridad junto con su filtro y tambien el filtro por fecha, para la fecha estaba pensando en tomar el valor de la fecha como valor numerico y para el from date pues que busque el valor de la fecha de cada task y vea que sea mayor a la fecha seleccionada y para el to date que sea el valor de la fecha menor o igual a este. Tambien podemos añadir la opcion de cambiar el valor del color, la fecha y el flag de prioridad en cada task

// Function to generate the task list
function generateTaskList() {
    // Gets the value of the task type filter input to know which type of tasks to show in the list
    const typeOfFilter = document.getElementById('task-type').value;
    const colorOfFilter = document.getElementById('filter-color').value;
    taskMainContainer.innerHTML = ''; // Clear the container before generating the list to avoid duplicates

    // Filtered list
    const filteredTaskList = taskList.filter(task => {
        // Variable that checks if the color matches the task color
        let matchesColor = false;
        if (colorOfFilter === '') {
        matchesColor = true;
        } else {
            matchesColor = task.color === colorOfFilter;
        }

        //Variable to check if the tasks match the type
        let matchesType = false;
        // Shows all the tasks
        if (typeOfFilter === 'all') {
            matchesType = true;
        }
        // Shows only completed tasks
        if (typeOfFilter === 'completed') {
            matchesType = task.completed === true;
        }
        // Shows only pending tasks
        if (typeOfFilter === 'pending') {
            matchesType = task.completed === false;
        }
        return matchesType && matchesColor;
    });

    // Generates a new li element for each task in the taskList array and appends it to the main container
    filteredTaskList.forEach(task => {
        const taskContainer = document.createElement('li');
        taskContainer.style.backgroundColor = task.color;
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
    colorFilterSelect.value = '';
    document.getElementById('filter-fromDate').value = '';
    document.getElementById('filter-toDate').value = '';
    // Generates the task list again
    generateTaskList();
};

// Clears the filters when the clear filters button is clicked
clearCompletedButton.addEventListener('click', clearFilters);

document.addEventListener('DOMContentLoaded', () => {
    const taskStorage = localStorage.getItem('tasks');

    // Function to create the color options for each task created
    function createColorOptions() {
        // Creates a new options element for each color in the taskColors object and appends the name using the key value for each option
        for (const [key, value] of Object.entries(taskColor)) {
            const option = document.createElement('option');
            option.value = value;
            // Capitalizes the first letter of the color name
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            colorInput.appendChild(option);
        }
    }

    // Function to create the color options for the filter
    function createColorFilters() {
        // Creates a new options element for each color in the taskColors object and appends the name using the key value for each option
        for (const [key, value] of Object.entries(taskColor)) {
            const option = document.createElement('option');
            option.value = value;
            // Capitalizes the first letter of the color name
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            colorFilterSelect.appendChild(option);
        }
    }

    if (taskStorage) {
        // If we have tasks in the local storage we convert the string back into an array to get assigned to the taskList variable and then it runs the generateTaskList function
        taskList = JSON.parse(taskStorage);
        generateTaskList();
        updateCompletedTasksCounter();
        updateTaskListCounter();
        createColorOptions();
        createColorFilters();
    }
});

// Listens to any changes on the select element for the task type filter and renders the list once again to show the updated information based on the selected filter
filterTypeSelect.addEventListener('change', () => {
    generateTaskList();
});

// Listens to any changes on the select element for the task color filter and renders the list once again to show the updated information based on the selected filter
colorFilterSelect.addEventListener('change', () => {
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
    const taskColor = colorInput.value;

    // If there is text in the task input field, it creates a new task object with its values and pushes that to the taskList object, then it clears the input fields for the next task
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            dueDate: dueDate,
            completed: false,
            important: false,
            color: taskColor,
        };  
        taskList.push(newTask);
        addToDoInput.value = '';
        dueDateInput.value = '';
        colorInput.value = '';
        console.log(taskList);
        // Runs the generateTaskList function to update the task list with the new task
        generateTaskList();
        updateTaskListCounter();
        // Runs the saveTasksToLocalStorage function to save the updated task list to local storage
        saveTasksToLocalStorage();
    }
};

// Looks for the submision event for the task form and runs the addTask function when the form is submitted
addToDoMenu.addEventListener('submit', addTask);