// Variables getting the form and input fields to create tasks

// Form input variables
const addToDoMenu = document.querySelector('form');
const addToDoInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const colorInput = document.getElementById('color-input');

// Filter variables
const filterTypeSelect = document.getElementById('task-type');
const colorFilterSelect = document.getElementById('filter-color');
const importantFilterSelect = document.getElementById('important-filter');
const fromDateInput = document.getElementById('filter-fromDate');
const toDateInput = document.getElementById('filter-toDate');

// Task List variables
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

// Ahora nos hace falta el poder cambiar el color de las task que ya son parte de la lista, al igual que poder editar la fecha y el texto de las tareas, mi unico problema es que lo de el color, puede ser un dropdown sin problemas, y la fecha igual un date input, pero el texto tendria que ser editable mas que nada cuando le das click a algun boton de editar, que me parece que seria mas facil de implementar una vez se añada el estilizado de la pagina, de momento seria solo implementar el poder editar el color y la fecha

// Hay que añadirles event listeners a los nuevos inputs para que al momento de cambiar los valores se genere el cambio en el array de tasks, solo modificando la task con el id que le corresponde y tambien tengo que añadirle al event listener del dom el que se generen las opciones de colores, que de hecho tengo que ver como hacer que se optimice eso para no tener que andar repitiendo ese codigo y que este solo en una function

//----------------------------------------Functions----------------------------------------

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
        taskContainer.style.backgroundColor = task.color;
        // Modify the html of each task if needed
        taskContainer.innerHTML = `
            <label for="completed-${task.id}">Completed</label>
            <input type="checkbox" class="task-checkbox" id="completed-${task.id}" ${task.completed ? 'checked' : ''}>
            <p>${task.text}</p>
            <select class="color-select" id="color-${task.id}">
            </select>
            <label for="due-date-${task.id}">Due Date:</label>
            <input type="date" class="due-date-input" id="due-date-${task.id}" value="${task.dueDate}">
            <button class="delete-button" data-id="${task.id}">Delete</button>
            <label for="important-${task.id}">Important</label>
            <input type="checkbox" class="priority-checkbox" id="important-${task.id}" ${task.important ? 'checked' : ''}>
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
});

// Event listener for when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Takes the tasks from the local storage and assigns them to the variable
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

    // If we have tasks in the local storage we convert the string back into an array to get assigned to the taskList variable and then it loads all the necessary information
    if (taskStorage) {
        taskList = JSON.parse(taskStorage);
        generateTaskList();
        updateCompletedTasksCounter();
        updateTaskListCounter();
        createColorOptions();
        createColorFilters();
    }
});

// Event listener for when there is a click on the document
document.addEventListener('click', (event) => {
    if (event.target.id === 'clear-filters') {
        clearFilters();
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

// Event listener for the form submission to add a new task
addToDoMenu.addEventListener('submit', addTask);