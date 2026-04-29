// Variables getting the form and input fields to create tasks

// Form input variables
const addToDoMenu = document.querySelector('form');
const addToDoInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const colorInput = document.getElementById('color-input');
const SubmitError = document.getElementById('submission-error');

// Filter variables
const filterTypeSelect = document.getElementById('task-type');
const colorFilterSelect = document.getElementById('filter-color');
const importantFilterSelect = document.getElementById('important-filter');
const fromDateInput = document.getElementById('filter-fromDate');
const toDateInput = document.getElementById('filter-toDate');
const todayFilter = document.getElementById('today-filter');

// Task List variables
const taskMainContainer = document.querySelector('ul');

// Task list variable
let taskList = [];
let showTodayTasks = false;

// Task color selection variable
const taskColor = {
    red: '#ff595e',
    yellow: '#ffca3a',
    green: '#8ac926',
    blue: '#1982c4',
    purple: '#6a4c93',
    pink: '#ff69b4',
} 

// Solo falta añadir los filtros para las tareas de hoy y tareas futuras al igual que añadir el editar el texto de las tasks despues de el estilizado, terminare los botones de filtro, añadire estilos y luego avanzare en la funcionalidad de editar el texto de las task
// Oye puedom añadir un contador de pending tasks igual

//----------------------------------------Functions----------------------------------------

 // Function to create the color options for each task created
function createColorOptions() {

    // Function to capizalize the first letter for the color options
    function capitalizeOption(option) {
        return option.charAt(0).toUpperCase() + option.slice(1);
    }

    // Function to create an option element for each color choice within the taskColor object
    function createOption(key, value) {
        const option = document.createElement('option');
        option.value = value;
        // Use the capitalize function on the text value for each color
        option.textContent = capitalizeOption(key);
        return option;
    }

    // Prevent duplicate options from being added if this function runs again
    if (colorInput.children.length > 1) return;

    // Creates a new options element for each color in the taskColors object and appends the name using the key value for each option
    for (const [key, value] of Object.entries(taskColor)) {
        // Variables to create the color options for each select element
        const optionTaskCreate = createOption(key, value);
        const optionFilter = createOption(key, value);

        // Appends the color options to each select element
        colorInput.appendChild(optionTaskCreate);
        colorFilterSelect.appendChild(optionFilter);
    }
}

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
        
        // If there is no color selected on the filter, it shows all the tasks, and if there is a color selected, it makes sure to only show the tasks that match that color
        if (colorOfFilter === '') {
        matchesColor = true;
        } else {
            matchesColor = task.color === colorOfFilter;
        }

        // Variable to check if the task is marked as important
        let matchesImportant = false;
        // If there important filter is checked, it shows only the tasks marked as important and it it is not checked, it shows all the task instead
        if (importantFilterSelect.checked) {
            matchesImportant = task.important === true;
        } else {
            matchesImportant = true;
        }

        // Variables to check if the tasks due date match the filter dates
        let matchesFromDate = true;
        let matchesToDate = true;

        // If there is a value entered on the from date, it filters the tasks to only show the ones with a due date greater or equal to the from date value
        if (fromDateInput.value) {
            const fromDateValue = new Date(fromDateInput.value);
            const taskDueDate = new Date(task.dueDate);
            matchesFromDate = taskDueDate >= fromDateValue;
        }

        // If there is a value entered on the to date, it filters the tasks to only show the ones with a due date less or equal to the to date value
        if (toDateInput.value) {
            const toDateValue = new Date(toDateInput.value);
            const taskDueDate = new Date(task.dueDate);
            matchesToDate = taskDueDate <= toDateValue;
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
        return matchesType && matchesColor && matchesImportant && matchesFromDate && matchesToDate; 
    });

    // Generates a new li element for each task in the taskList array and appends it to the main container
    filteredTaskList.forEach(task => {
        const taskContainer = document.createElement('li');
        //const taskColorContainer = getElementbyClassName('task-left');
        //taskColorContainer.style.backgroundColor = task.color;
        // Modify the html of each task if needed
        taskContainer.innerHTML = `
            <div class="task-right">
                <div class="task-text">
                    <input type="text" class="task-text-input" id="text-${task.id}" value="${task.text}">
                </div>
                <div class="task-right-container">
                    <div class="task-dueDate">
                        <label for="dueDate-${task.id}">Due Date:</label>
                        <input type="date" class="due-date-input" id="dueDate-${task.id}" value="${task.dueDate}">
                    </div>
                    <div class="tasks">
                        <div class="task-checkbox-container">
                            <label for="important-${task.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 496C342.1 496 360 513.9 360 536C360 558.1 342.1 576 320 576C297.9 576 280 558.1 280 536C280 513.9 297.9 496 320 496zM320 64C346.5 64 368 85.5 368 112C368 112.6 368 113.1 368 113.7L352 417.7C351.1 434.7 337 448 320 448C303 448 289 434.7 288 417.7L272 113.7C272 113.1 272 112.6 272 112C272 85.5 293.5 64 320 64z"/></svg></label>
                            <input type="checkbox" class="priority-checkbox" id="important-${task.id}" ${task.important ? 'checked' : ''}>
                        </div>
                        <div class="task-checkbox-container">
                            <label for="completed-${task.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64zM438 225.7C427.3 217.9 412.3 220.3 404.5 231L285.1 395.2L233 343.1C223.6 333.7 208.4 333.7 199.1 343.1C189.8 352.5 189.7 367.7 199.1 377L271.1 449C276.1 454 283 456.5 289.9 456C296.8 455.5 303.3 451.9 307.4 446.2L443.3 259.2C451.1 248.5 448.7 233.5 438 225.7z"/></svg></label>
                            <input type="checkbox" class="task-checkbox" id="completed-${task.id}" ${task.completed ? 'checked' : ''}>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-left">
                <select class="color-select" id="color-${task.id}">
                </select>
                <button class="delete-button" data-id="${task.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/></svg></button>
            </div>
        `;

        // Add the task color to the left part of the li container
        const taskLeft = taskContainer.querySelector('.task-left');
        taskLeft.style.backgroundColor = task.color;

        // Creates the color options for each task using the values from the taskColor object and sets the selected value to match the color of the task
        const taskColorSelectElement = taskContainer.querySelector('.color-select');
        for (const [key, value] of Object.entries(taskColor)) {
            // Creates an option element for each color choice within the taskColor object and takes de value from each option
            const option = document.createElement('option');
            option.value = value;
            // Capitalizes the first letter of the color name for the option text
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            // Sets the selected value for the color select element to match the color of the task
            if (value === task.color) option.selected = true;
            // Adds the color option to the select element
            taskColorSelectElement.appendChild(option);
        }

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
    updatePendingTasksCounter();
    saveTasksToLocalStorage();
    createColorOptions();
}

// Function to clear the filters
function clearFilters() {
    // Resets the values of all the filter options to show all tasks
    filterTypeSelect.value = 'all';
    colorFilterSelect.value = '';
    importantFilterSelect.checked = false;
    document.getElementById('filter-fromDate').value = '';
    document.getElementById('filter-toDate').value = '';
    // Generates the task list again
    generateTaskList();
};

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

function updatePendingTasksCounter() {
    const pendingTasksCounter = document.getElementById('pending-tasks');
    // Filters the taskList to only look for the tasks with the completed value
    const pendingTasksList = taskList.filter(task => task.completed === false);
    // Changes the value for the pendingTasksCounter to match the lenght of the list of pending tasks
    pendingTasksCounter.textContent = pendingTasksList.length;
};

// Function to add a new task to the list
function addTask(event) {
    // Avoids reloading the page when the form is submitted
    event.preventDefault();
    // Gets the text and due date values from the form submission
    const taskText = addToDoInput.value;
    const dueDate = dueDateInput.value;
    const taskColor = colorInput.value;

    // If there is text in the task input field and all form fields are filled, it creates a new task object with its values and pushes that to the taskList object
    if (taskText && dueDate && taskColor) {
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
        // Runs the generateTaskList function to update the task list with the new task
        generateTaskList();
        updateTaskListCounter();
        // Runs the saveTasksToLocalStorage function to save the updated task list to local storage
        saveTasksToLocalStorage();
        createColorOptions();
        SubmitError.textContent = '';
    } else {
        SubmitError.textContent = '*Please fill in all of the fields to add a task.';
    }
};

//----------------------------------------Event Listeners----------------------------------------

// Event listener for changes in the document
document.addEventListener('change', (event) => {
    // Converts the id value from a string to a number
    let taskId = parseInt(event.target.id.split('-')[1]);
    // Find the task in the task list that matches the id to only apply the changes to the corresponding task
    const task = taskList.find(task => task.id === taskId);

    // Checks if there is a change on the class task-checkbox to know if the checkbox is marked as completed or unselected
    if (event.target.classList.contains('task-checkbox')) {
        if (task) {
            task.completed = event.target.checked;
            updateCompletedTasksCounter();
            updatePendingTasksCounter();
            saveTasksToLocalStorage();
        }
    }

    // Checks if there is a change on the class priority-checkbox to know if the checkbox is marked as important or unselected
    if (event.target.classList.contains('priority-checkbox')) {     
        if (task) {
            task.important = event.target.checked;
            saveTasksToLocalStorage();
        }
    }

    // Checks if there is a change on the class filter-options to know if the user has changed any of the filter options and needs to update the task list
    if (event.target.classList.contains('filter-options')) {
        generateTaskList();
    }

    // Looks for the color-select class to know if the value for the color was changed
    if (event.target.classList.contains('color-select')) {
        if (task) {
            // Updates the color value
            task.color = event.target.value;
            generateTaskList();
            saveTasksToLocalStorage();
            createColorOptions()
        }
    }

    // Looks for the due-date-input class to know if the value for the due date was changed
    if (event.target.classList.contains('due-date-input')) {
        if (task) {
            // Updates the due date value
            task.dueDate = event.target.value;
            generateTaskList();
            saveTasksToLocalStorage();
            createColorOptions()
        }
    }

    // Looks for the task-text-input class to know if the value for the task text was changed
    if (event.target.classList.contains('task-text-input')) {
        if (task) {
            // Updates the text value
            task.text = event.target.value;
            generateTaskList();
            saveTasksToLocalStorage();
            createColorOptions()
        }
    }
});

// Event listener for when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Takes the tasks from the local storage and assigns them to the variable
    const taskStorage = localStorage.getItem('tasks');

    // If we have tasks in the local storage we convert the string back into an array to get assigned to the taskList variable and then it loads all the necessary information
    if (taskStorage) {
        taskList = JSON.parse(taskStorage);
        generateTaskList();
        updateCompletedTasksCounter();
        updatePendingTasksCounter()
        updateTaskListCounter();
    }

    createColorOptions();
});

// Event listener for when there is a click on the document
document.addEventListener('click', (event) => {
    if (event.target.id === 'clear-filters') {
        showTodayTasks = false;
        clearFilters();
    }

    if (event.target.id === 'today-filter') {
        showTodayTasks = true;
        generateTaskList();
    }
});

// Event listener for the delete buttons inside the "ul" element
taskMainContainer.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-button');

    // No action if the button clicked is not a delete button
    if (!deleteButton) return;

    // Gets the id from the list item from the closest button clicked on and uses that value to run the deleteTask function
    const taskIdValue = parseInt(deleteButton.getAttribute('data-id'));
    deleteTask(taskIdValue);
});

// Event listener for the "Enter" key to create a new task when using the task creation form
addToDoMenu.addEventListener('keydown', (event) => {
    // If the focus is on the task creation form and there is a value entered on the task then it creates the task and clears the input fields
    if (addToDoMenu.contains(addToDoInput) && addToDoInput.value.trim() !== '' && dueDateInput.value.trim() !== '' && colorInput.value.trim() !== '' && event.key === 'Enter') {
        event.preventDefault();
        addTask(event);
        SubmitError.textContent = '';
    }
    // If there is no value on one of the form fields, it throws an error message asking to fill in all the fields to be able to create a task
    else if (addToDoMenu.contains(addToDoInput) && event.key === 'Enter') {
        event.preventDefault();
        SubmitError.textContent = '*Please fill in all of the fields to add a task.';
    }
});

// Event listener for the form submission to add a new task
addToDoMenu.addEventListener('submit', (event) => {
    if (addToDoInput.value.trim() === '' || dueDateInput.value.trim() === '' || colorInput.value.trim() === '') {
        event.preventDefault();
        SubmitError.textContent = '*Please fill in all of the fields to add a task.';
        return;
    }
    addTask(event);
});