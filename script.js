document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("customModal");
    const input = document.getElementById("modalInput");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    let currentColumn = null;

    // Obtém o nome da página atual para usar como chave no localStorage
    const pageKey = window.location.pathname.split("/").pop().replace(".html", "");

    document.querySelectorAll(".add-task").forEach(button => {
        button.addEventListener("click", function () {
            openModal(this.parentElement.id);
        });
    });

    window.openModal = function (columnId) {
        if (!columnId) return;
        currentColumn = columnId;
        input.value = "";
        modal.style.display = "flex";
        input.focus();
    };

    cancelBtn.onclick = () => {
        modal.style.display = "none";
        currentColumn = null;
    };

    window.onclick = event => {
        if (event.target === modal) {
            modal.style.display = "none";
            currentColumn = null;
        }
    };

    confirmBtn.onclick = () => {
        const taskName = input.value.trim();
        if (taskName && currentColumn) {
            const column = document.querySelector(`#${currentColumn} .tasks`);
            if (column) {
                const task = createTaskElement(taskName);
                column.appendChild(task);
                saveTasks();
                modal.style.display = "none";
                currentColumn = null;
            }
        }
    };

    function createTaskElement(taskName) {
        const task = document.createElement("div");
        task.className = "task";
        task.draggable = true;
        task.innerText = taskName;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.innerText = "X";
        deleteButton.style.backgroundColor = "white";
        deleteButton.style.border = "none";
        deleteButton.style.color = "red";
        deleteButton.style.fontSize = "16px";
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", () => deleteTask(task));

        task.appendChild(deleteButton);
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dragend", dragEnd);

        return task;
    }

    function deleteTask(task) {
        if (confirm("Tem certeza que deseja excluir este projeto?")) {
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
                tasksData[columnId].push(task.firstChild.textContent.trim());
            });
        });

        localStorage.setItem(`tasksData_${pageKey}`, JSON.stringify(tasksData));
    }

    function loadTasks() {
        const tasksData = JSON.parse(localStorage.getItem(`tasksData_${pageKey}`)) || {};

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
    }

    let draggedTask = null;

    function dragStart() {
        draggedTask = this;
        setTimeout(() => (this.style.display = "none"), 0);
    }

    function dragEnd() {
        setTimeout(() => {
            this.style.display = "block";
            saveTasks();
        }, 0);
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

    loadTasks();
});