document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

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

    const taskText = document.createElement("span");
    taskText.innerText = taskName;

    const deleteButton = createDeleteButton(task);

    task.appendChild(taskText);
    task.appendChild(deleteButton);

    task.addEventListener("click", () => editTask(task, taskText));
    task.addEventListener("dblclick", () => editTask(task, taskText));
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);

    return task;
}

function createDeleteButton(task) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.innerText = "X";
    deleteButton.style.backgroundColor = "transparent";
    deleteButton.style.border = "none";
    deleteButton.style.color = "red";
    deleteButton.style.fontSize = "16px";
    deleteButton.style.cursor = "pointer";

    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTask(task);
    });

    return deleteButton;
}

function editTask(task, taskText) {
    const newTaskName = prompt("Edite o nome do projeto:", taskText.innerText.trim());
    if (newTaskName) {
        taskText.innerText = newTaskName;
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
            const taskText = task.querySelector("span");
            if (taskText) {
                tasksData[columnId].push(taskText.innerText.trim());
            }
        });
    });

    localStorage.setItem("sharedTasksData", JSON.stringify(tasksData));
}

function loadTasks() {
    const tasksData = JSON.parse(localStorage.getItem("sharedTasksData"));
    if (tasksData) {
        for (const columnId in tasksData) {
            const column = document.querySelector(`#${columnId} .tasks`);
            if (column) {
                column.innerHTML = "";
                tasksData[columnId].forEach(taskName => {
                    const task = createTaskElement(taskName);
                    column.appendChild(task);
                });
            }
        }
    } else {
        const exampleTask = "Projeto Exemplo";
        const column = document.querySelector("#projects .tasks");
        if (column) {
            const task = createTaskElement(exampleTask);
            column.appendChild(task);
            saveTasks();
        }
    }
}

let draggedTask = null;

function dragStart(event) {
    draggedTask = this;
    event.dataTransfer.setData("text/plain", null); // Necessário para Firefox
    setTimeout(() => (this.style.display = "none"), 0);
}

function dragEnd() {
    this.style.display = "block";
    draggedTask = null;
}

document.querySelectorAll(".column .tasks").forEach(tasksContainer => {
    tasksContainer.addEventListener("dragover", (e) => e.preventDefault());
    tasksContainer.addEventListener("drop", function () {
        if (draggedTask) {
            this.appendChild(draggedTask);
            saveTasks();
        }
    });
});
