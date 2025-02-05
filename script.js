const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", function(e) {
	e.preventDefault();
	addTodo();
})

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        };

        allTodos.push(todoObject);
        saveTodos();
        todoInput.value = "";

        // Очищаем список и рендерим его заново
        todoListUL.innerHTML = "";
        allTodos.forEach((todo, todoIndex) => {
            const isLast = todoIndex === allTodos.length - 1;
            const todoItem = createTodoItem(todo, todoIndex, isLast); // Анимация только для последнего элемента
            todoListUL.append(todoItem);
        });
    }
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        const isLast = todoIndex === allTodos.length - 1;
        const todoItem = createTodoItem(todo, todoIndex, false); // Анимация отключена
        todoListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex, animate = false) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;

    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label for="${todoId}" class="custom-checkbox">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });

    checkbox.checked = todo.completed;

    // Добавляем анимацию только если animate = true
    if (animate) {
        todoLI.style.opacity = 0;
        todoLI.style.transform = "translateY(20px)";
        setTimeout(() => {
            todoLI.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
            todoLI.style.opacity = 1;
            todoLI.style.transform = "translateY(0)";
        }, 10);
    }

    return todoLI;
}

function deleteTodoItem(todoIndex) {
    const todoItem = document.querySelector(`#todo-${todoIndex}`).closest('li');

    // Добавляем класс для анимации удаления
    todoItem.classList.add('fade-out');

    // Ждем завершения анимации, затем удаляем элемент
    todoItem.addEventListener('animationend', () => {
        allTodos = allTodos.filter((_, i) => i !== todoIndex); // Удаляем задачу из массива
        saveTodos();
        updateTodoList(); // Обновляем список
    }, { once: true }); // Обработчик сработает только один раз
}

function saveTodos() {
	const todosJson = JSON.stringify(allTodos);
	localStorage.setItem("todos", todosJson);
}

function getTodos() {
	const todos = localStorage.getItem("todos") || "[]";
	return JSON.parse(todos);
}