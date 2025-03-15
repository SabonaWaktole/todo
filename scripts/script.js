const themeToggleButton = document.querySelector('.theme-toggle-btn');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.textContent = '🌞';
    } else {
        themeToggleButton.textContent = '🌙';
    }
});

const taskModal = document.getElementById('taskModal');
const taskEditModal = document.getElementById('taskEditModal');
const closeBtns = document.querySelectorAll('.close-btn');
const submitTaskBtn = document.getElementById('submitTaskBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const newTaskInput = document.getElementById('newTaskInput');
const editTaskInput = document.getElementById('editTaskInput');
const taskList = document.querySelector('.task-list');
const filterDropdown = document.querySelector('select');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentEditIndex = null;
const escapeHtml = (input) => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
const renderTasks = (tasksToRender = tasks) => {
    taskList.innerHTML = '';

    if (tasksToRender.length === 0) {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.textContent = 'No tasks found.';
        taskList.appendChild(noTasksMessage);
        return;
    }

    tasksToRender.forEach((task, index) => {
        const newTask = document.createElement('li');
        newTask.classList.add('task');
        const escapedText = escapeHtml(task.text);
        if (task.checked) {
            newTask.classList.add('checked');
        }
        newTask.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.checked ? 'checked' : ''}>
            ${escapedText}
            <span class="task-actions">
                <button class="edit-btn">
                    <img src="../resources/editbutton.png" alt="Edit" />
                </button>
                <button class="delete-btn">
                    <img src="../resources/deletebutton.png" alt="Delete" />
                </button>
            </span>
        `;
        taskList.appendChild(newTask);

        const checkbox = newTask.querySelector('.task-checkbox');
        const editButton = newTask.querySelector('.edit-btn');
        const deleteButton = newTask.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => toggleTaskCompletion(index));
        editButton.addEventListener('click', () => editTask(index));
        deleteButton.addEventListener('click', () => deleteTask(index));
    });
    tasks = tasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


const toggleTaskCompletion = (index) => {
    tasks[index].checked = !tasks[index].checked;
    const sortedTasks = tasks.slice().sort((a, b) => {
        if (a.checked && !b.checked) return 1;
        if (!a.checked && b.checked) return -1;
        return 0;
    });
    tasks = sortedTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    console.log(tasks);
};

const editTask = (index) => {
    currentEditIndex = index;
    editTaskInput.value = tasks[index].text;
    taskEditModal.style.display = 'block';
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
};

const addTaskButton = document.querySelector('.add-task-btn');
addTaskButton.addEventListener('click', () => {
    taskModal.style.display = 'block';
});

closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        taskModal.style.display = 'none';
        taskEditModal.style.display = 'none';
    });
});
submitTaskBtn.addEventListener('click', () => {
    const newTaskText = newTaskInput.value.trim();
    if (newTaskText !== '') {
        tasks.unshift({ text: newTaskText, checked: false });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        newTaskInput.value = '';
        taskModal.style.display = 'none';
    }
});

saveEditBtn.addEventListener('click', () => {
    const newTaskText = editTaskInput.value.trim();
    if (newTaskText !== '') {
        tasks[currentEditIndex].text = newTaskText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskEditModal.style.display = 'none';
    }
});

window.addEventListener('click', (event) => {
    if (event.target === taskModal) {
        taskModal.style.display = 'none';
    }
    if (event.target === taskEditModal) {
        taskEditModal.style.display = 'none';
    }
});

const searchInput = document.querySelector('input[name="search"]');
searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredTasks = tasks.filter((task) => task.text.toLowerCase().includes(query));
    renderTasks(filteredTasks);
});

filterDropdown.addEventListener('change', (event) => {
    const filterValue = event.target.value;
    let filteredTasks = tasks;

    if (filterValue === 'pending') {
        filteredTasks = tasks.filter((task) => !task.checked);
    } else if (filterValue === 'completed') {
        filteredTasks = tasks.filter((task) => task.checked);
    }

    renderTasks(filteredTasks);
});

renderTasks();