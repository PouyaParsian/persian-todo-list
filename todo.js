// Select DOM elements
const addTaskBtn = document.querySelector('.input-container button');
const inputBox = document.querySelector('.input-container input');
const todoListContainer = document.querySelector('.todo-list-container');
const numberOfTasksElement = document.querySelector('.info-container p span');
const removeAllTasksBtn = document.querySelector('.info-container button');
const removeDialog = document.querySelector('.remove-dialog');
const editDialog = document.querySelector('.edit-dialog');

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
                                <button class="remove-btn" aria-label="حذف کار">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button class="edit-btn" aria-label="ویرایش کار">
                                    <i class="fa fa-pencil"></i>
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
    } else if (e.target.closest('.remove-btn')) {
        deleteTask(index);
    } else if (e.target.closest('.edit-btn')) {
        editTask(index);
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

// Edit single task
function editTask(index) {
    const userTasks = getTasks();
    const taskText = userTasks[index].text;
    const taskInput = editDialog.querySelector('input[type="text"]');
    editDialog.showModal();
    taskInput.value = taskText;
    editDialog.querySelector('.btnSave').onclick = () => {

    };
    editDialog.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnCancel')) {
            editDialog.close();
        } else if (e.target.classList.contains('btnSave')) {
            const newText = taskInput.value.trim();
            if (newText !== "") {
                userTasks[index].text = newText;
                if (isLocalStorageAvailable()) {
                    localStorage.setItem('tasks', JSON.stringify(userTasks));
                }
                showTasks();
                editDialog.close();
            }
        }
    });
}

// Remove all tasks
removeAllTasksBtn.addEventListener('click', () => {
    if (getTasks().length > 0) {
        removeDialog.showModal();
    }
});

removeDialog.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnYes')) {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem('tasks');
        }
        showTasks();
        removeDialog.close();
    } else if (e.target.classList.contains('btnNo')) {
        removeDialog.close();
    }
});

// Initial render
showTasks();