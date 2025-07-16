// Select DOM elements
const addTaskBtn = document.querySelector('.input-container button');
const inputBox = document.querySelector('.input-container input');
const todoListContainer = document.querySelector('.todo-list-container');
const numberOfTasksElement = document.querySelector('.info-container p span');
const removeAllTasksBtn = document.querySelector('.info-container button');

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// Get tasks from localStorage
function getTasks() {
    if (!isLocalStorageAvailable()) return [];
    try {
        return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    } catch (e) {
        console.error('Error parsing tasks from localStorage:', e);
        return [];
    }
}

// Sanitize user input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Show tasks in the list
function showTasks() {
    const userTasks = getTasks();
    let taskListHTML = "";
    userTasks.forEach((element, index) => {
        taskListHTML += `<li data-index="${index}">${sanitizeInput(element)}
                            <button aria-label="حذف کار">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </li>`;
    });
    todoListContainer.innerHTML = taskListHTML;
    numberOfTasksElement.textContent = userTasks.length;
}

// Add new task
addTaskBtn.addEventListener('click', () => {
    const userTasks = getTasks();
    const userTask = inputBox.value.trim();
    if (userTask !== "") {
        userTasks.push(userTask);
        if (isLocalStorageAvailable()) {
            localStorage.setItem('tasks', JSON.stringify(userTasks));
        }
        showTasks();
        inputBox.value = "";
    }
});

// Add task with Enter key
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Delete task using event delegation
todoListContainer.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        const index = e.target.closest('li').dataset.index;
        deleteTask(index);
    }
});

// Delete single task
function deleteTask(index) {
    const userTasks = getTasks();
    userTasks.splice(index, 1);
    if (isLocalStorageAvailable()) {
        localStorage.setItem('tasks', JSON.stringify(userTasks));
    }
    showTasks();
}

// Remove all tasks
removeAllTasksBtn.addEventListener('click', () => {
    if (isLocalStorageAvailable()) {
        localStorage.removeItem('tasks');
    }
    showTasks();
});

// Initial render
showTasks();