document.addEventListener("DOMContentLoaded", () => {
    if (!canEnter()) {
        alert("Limite de usuários atingido. Não é possível entrar.");
        return;
    }
    loadTasks();
});


function canEnter() {
    let userCount = localStorage.getItem("userCount");
    userCount = userCount ? parseInt(userCount) : 0;

    if (userCount >= 9000000000) {
        return false;
    } else {
        localStorage.setItem("userCount", userCount + 1);
        return true;
    }
}


function registerUser() {
    const email = prompt("Digite seu email:");
    const password = prompt("Digite sua senha:");

    const users = JSON.parse(localStorage.getItem("users")) || [];


    if (users.some(user => user.email === email)) {
        alert("Usuário já registrado.");
        return;
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Usuário registrado com sucesso.");
}


function loginUser() {
    const email = prompt("Digite seu email:");
    const password = prompt("Digite sua senha:");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", email);
        alert("Login bem-sucedido!");
    } else {
        alert("Email ou senha inválidos.");
    }
}


function addTask(columnId) {
    const taskName = prompt("Digite o nome do novo projeto:");
    if (taskName) {
        const column = document.querySelector(`#${columnId} .tasks`);
        if (column) {
            const task = createTaskElement(taskName);
            column.appendChild(task);
            saveTasks();
        } else {
            console.error(`Coluna com ID "${columnId}" não encontrada.`);
        }
    }
}


function createTaskElement(taskName) {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.innerText = taskName;


    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.innerText = "X";


    deleteButton.style.backgroundColor = "transparent";
    deleteButton.style.border = "none";
    deleteButton.style.color = "red";
    deleteButton.style.fontSize = "16px";
    deleteButton.style.cursor = "pointer";
    deleteButton.addEventListener("click", () => deleteTask(task));


    task.appendChild(deleteButton);


    task.addEventListener("dblclick", () => editTask(task));


    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);

    return task;
}


function editTask(task) {
    const newTaskName = prompt("Edite o nome do projeto:", task.innerText.replace("X", "").trim());
    if (newTaskName) {
        task.innerText = newTaskName;


        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerText = "X";


        deleteButton.style.backgroundColor = "transparent";
        deleteButton.style.border = "none";
        deleteButton.style.color = "red";
        deleteButton.style.fontSize = "16px";
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", () => deleteTask(task));
        task.appendChild(deleteButton);

        saveTasks();
    }
}


function deleteTask(task) {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        task.remove();
        saveTasks();
    }
}


function saveTasks() {
    const columns = document.querySelectorAll(".column");
    const tasksData = {};

    columns.forEach(column => {
        const columnId = column.id;
        const tasks = column.querySelectorAll(".task");
        tasksData[columnId] = [];

        tasks.forEach(task => {
            tasksData[columnId].push(task.innerText.replace("X", "").trim());
        });
    });

    localStorage.setItem("tasksData", JSON.stringify(tasksData));
}


function loadTasks() {
    const tasksData = JSON.parse(localStorage.getItem("tasksData"));

    if (tasksData) {
        for (const columnId in tasksData) {
            const column = document.querySelector(`#${columnId} .tasks`);
            if (column) {
                tasksData[columnId].forEach(taskName => {
                    const task = createTaskElement(taskName);
                    column.appendChild(task);
                });
            } else {
                console.warn(`Coluna com ID "${columnId}" não encontrada.`);
            }
        }
    }
}


let draggedTask = null;


function dragStart() {
    draggedTask = this;
    setTimeout(() => (this.style.display = "none"), 0);
}


function dragEnd() {
    this.style.display = "block";
    draggedTask = null;
}


document.querySelectorAll(".column .tasks").forEach(tasksContainer => {
    tasksContainer.addEventListener("dragover", e => e.preventDefault());

    tasksContainer.addEventListener("drop", function () {
        if (draggedTask) {
            this.appendChild(draggedTask);
            saveTasks();
        }
    });
});
