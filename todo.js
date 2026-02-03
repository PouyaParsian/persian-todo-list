// Select DOM elements
const addTaskBtn = document.querySelector('.input-container button');
const inputBox = document.querySelector('.input-container input');
const todoListContainer = document.querySelector('.todo-list-container');
const numberOfTasksElement = document.querySelector('.info-container p span');
const removeAllTasksBtn = document.querySelector('.info-container button');
const dialog = document.querySelector('.dialog');

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
        const completedClass = element.completed ? 'completed' : '';
        taskListHTML += `<li data-index="${index}" class="${completedClass}">
                            ${sanitizeInput(element.text)}
                            <div class="task-buttons">
                                <button class="check-btn" aria-label="تیک زدن کار">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button aria-label="حذف کار">
                                    <i class="fa fa-remove"></i>
                                </button>
                            </div>
                        </li>`;
    });
    todoListContainer.innerHTML = taskListHTML;
    numberOfTasksElement.textContent = userTasks.filter(task => !task.completed).length;
}

// Add new task
addTaskBtn.addEventListener('click', () => {
    const userTasks = getTasks();
    const userTask = inputBox.value.trim();
    if (userTask !== "") {
        userTasks.push({ text: userTask, completed: false });
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

// Handle clicks on todo list (event delegation)
todoListContainer.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const index = li.dataset.index;

    if (e.target.closest('.check-btn')) {
        toggleTaskCompletion(index);
    } else if (e.target.closest('button:not(.check-btn)')) {
        deleteTask(index);
    }
});

// Toggle task completion
function toggleTaskCompletion(index) {
    const userTasks = getTasks();
    userTasks[index].completed = !userTasks[index].completed;
    if (isLocalStorageAvailable()) {
        localStorage.setItem('tasks', JSON.stringify(userTasks));
    }
    showTasks();
}

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
    if (getTasks().length > 0) {
        dialog.showModal();
    }
});

dialog.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnYes')) {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem('tasks');
        }
        showTasks();
        dialog.close();
    } else if (e.target.classList.contains('btnNo')) {
        dialog.close();
    }
});

// Initial render
showTasks();