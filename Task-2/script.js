document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('contactForm');
    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;
            if (nameInput.value.trim() === '') {
                alert('Please enter your name.');
                isValid = false;
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                alert('Please enter a valid email address.');
                isValid = false;
                return;
            }
            if (messageInput.value.trim() === '') {
                alert('Please enter a message.');
                isValid = false;
                return;
            }
            if (isValid) {
                alert('Form submitted successfully!');
                form.submit();
            }
        });
    }

    const todoInput = document.getElementById('todoInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const todoList = document.getElementById('todoList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach((taskText, index) => {
            const listItem = document.createElement('li');
            const taskSpan = document.createElement('span');
            taskSpan.textContent = taskText;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';

            removeBtn.addEventListener('click', function() {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            listItem.appendChild(taskSpan);
            listItem.appendChild(removeBtn);
            todoList.appendChild(listItem);
        });
    }

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText !== "") {
            tasks.push(taskText);
            saveTasks();
            renderTasks();
            todoInput.value = '';
        } else {
            alert("Please enter a task.");
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    
    todoInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});