document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("customModal");
    const input = document.getElementById("modalInput");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    let currentColumn = null;

    // Garante que o modal inicie escondido
    modal.style.display = "none";

    document.querySelectorAll(".add-task").forEach(button => {
        button.addEventListener("click", function () {
            openModal(this.parentElement.id);
        });
    });

    function openModal(columnId) {
        console.log("openModal chamado com:", columnId); // Log para depuração
        if (columnId) {
            currentColumn = columnId;
            input.value = "";
            modal.style.display = "flex";
            input.focus();
        }
    }

    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    confirmBtn.addEventListener("click", () => {
        const taskName = input.value.trim();
        if (taskName) {
            const column = document.querySelector(`#${currentColumn} .tasks`);
            if (column) {
                const task = document.createElement("div");
                task.className = "task";
                task.innerText = taskName;
                column.appendChild(task);
                modal.style.display = "none";
            }
        }
    });
});