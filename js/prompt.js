document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("customModal");
    const input = document.getElementById("modalInput");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    let currentColumn = null;
    let draggedTask = null; // Armazena a tarefa que está sendo arrastada

    // Abre o modal para adicionar tarefa
    const openModal = (columnId) => {
        if (columnId) {
            currentColumn = columnId;
            input.value = "";
            modal.style.display = "flex";
            input.focus();
        }
    };

    const closeModal = () => {
        modal.style.display = "none";
        currentColumn = null;
    };

    // Fecha modal com tecla ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    // Adiciona evento para abrir o modal
    document.querySelectorAll(".add-task").forEach(button => {
        button.addEventListener("click", function () {
            openModal(this.parentElement.id);
        });
    });

    // Fecha o modal
    cancelBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });

    // Confirma e adiciona a tarefa
    confirmBtn.addEventListener("click", () => {
        const taskName = input.value.trim();
        if (!taskName || !currentColumn) return;

        const column = document.querySelector(`#${currentColumn} .tasks`);
        if (column) {
            // Verifica se a tarefa já existe na coluna
            if ([...column.children].some(task => task.textContent === taskName)) {
                alert("Essa tarefa já existe!");
                return;
            }

            const task = createTaskElement(taskName);
            column.appendChild(task);
            closeModal();
        }
    });

    // Cria um elemento de tarefa com eventos necessários
    const createTaskElement = (taskName) => {
        const task = document.createElement("div");
        task.className = "task";
        task.textContent = taskName;
        task.draggable = true;
        task.addEventListener("dragstart", dragStart);
        task.addEventListener("dblclick", editTask);
        return task;
    };

    // Permite edição da tarefa ao dar dois cliques
    const editTask = (event) => {
        const task = event.target;
        const newName = prompt("Editar tarefa:", task.textContent);
        if (newName && newName.trim() !== "") {
            task.textContent = newName.trim();
        }
    };

    // Função para iniciar o arrasto
    const dragStart = (event) => {
        draggedTask = event.target;
        event.dataTransfer.setData("text", draggedTask.textContent);
        setTimeout(() => draggedTask.style.display = "none", 0);
    };

    // Eventos de arrastar e soltar
    document.querySelectorAll(".tasks").forEach(column => {
        column.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        column.addEventListener("drop", (event) => {
            event.preventDefault();
            if (!draggedTask) return;

            const targetColumn = event.currentTarget;
            const taskName = draggedTask.textContent;

            // Evita mover para a mesma coluna
            if (draggedTask.parentElement === targetColumn) {
                draggedTask.style.display = "block";
                return;
            }

            // Verifica se já existe a mesma tarefa na nova coluna
            if ([...targetColumn.children].some(task => task.textContent === taskName)) {
                alert("Essa tarefa já existe aqui!");
                draggedTask.style.display = "block";
                return;
            }

            // Remove a tarefa da coluna original e adiciona na nova
            draggedTask.parentElement.removeChild(draggedTask);
            draggedTask.style.display = "block";
            targetColumn.appendChild(draggedTask);
        });
    });
});
