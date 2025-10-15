document.querySelector("#create-form").addEventListener("submit", (e) => {
  e.preventDefault();
  createTodo(e);
});

let currentFilter = "all";
let currentSearch = "";

const splitButtonClickHandler = (target) => {
  const splitButton = document.querySelector(".split-button");
  [...splitButton.children].forEach((element) =>
    element.classList.remove("split-button__button--active")
  );
  target.classList.add("split-button__button--active");
  if (target.id === "filter-active") {
    currentFilter = "activ";
  } else if (target.id === "filter-done") {
    currentFilter = "done";
  } else {
    currentFilter = "all";
  }
  renderTodos();
};

const getTodos = () => {
  return JSON.parse(localStorage.getItem("todosStorage"));
};

const renderTodos = () => {
  const localStorageTodos = JSON.parse(localStorage.getItem("todosStorage"));
  //Array. isArray (проверка на то является ли этот элемент массивом)
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    //получаем контейнер элементов
    const container = document.querySelector(".todo-list");
    container.innerHTML = "";
    //проходим по массиву элементов и по одному добавляем в контейнер
    const formatSearchString = (currentSearch || "").trim().toLowerCase();
    const todosToRender = localStorageTodos
      .filter((todo) => {
        if (currentFilter === "activ") return !todo.done;
        if (currentFilter === "done") return !!todo.done;
        return true;
      })
      .filter((todo) => {
        if (!currentSearch) return true;
        return String(todo.description || "")
          .toLowerCase()
          .includes(formatSearchString);
      });

    todosToRender.forEach((todo) => {
      const startDate = new Date(todo.startDate).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
      });
      const id = todo.id;
      //разметка элемента
      container.insertAdjacentHTML(
        "beforeend",
        `
        <li class="todo-block">
        <label class="checkbox" for="${id}" onclick="toggleTodoDone('${id}')">
        <input type="checkbox" name="${id}" id="${id}" ${
          todo.done ? "checked" : ""
        }/>
        <span class="material-symbols-rounded   checkbox__check-icon">
        check
        </span>
        </label>
        <div class="todo-block__data">
            <p class="todo-block__date">${startDate}</p>
            <h3 class="todo-block__title">${todo.description}</h3>
        </div>
        <span class="material-symbols-rounded" onclick="deleteTodo('${id}')">
        close
        </span>
        </li>
        `
      );
    });
  }
};

const createTodo = (e) => {
  e.preventDefault();
  const startDate = document.querySelector("#startDate").value;
  const description = document.querySelector("#description").value;
  //получаем текущее значение из localStorage
  const localStorageTodos = getTodos();
  //создаем объект новой записи
  const newTodo = {
    //создаем случайный id, чтобы иметь возможность без проблем найти необходимую запись
    id: "todo_" + Math.random().toString(16).slice(2),
    //текущая дата
    createdAt: new Date(),
    startDate,
    description,
    done: false,
  };
  //проверка на то, что localStorage имеет такой объект и он является массивом
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    //если условие истинно, добавляем новыу запись в массив и записываем в localStorage;
    localStorageTodos.push(newTodo);
    localStorage.setItem("todosStorage", JSON.stringify(localStorageTodos));
  } else {
    //если условие ложно, записываем массив с одним элементов в localStorage
    localStorage.setItem("todosStorage", JSON.stringify([newTodo]));
  }
  //вызываем функцию рендера для обновления списка
  renderTodos();
};

const toggleTodoDone = (todoId) => {
  const localStorageTodos = getTodos();
  //проверка на то, что localStorage имеет такой объект и он является массивом
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    //фильтруем массив, удаляя необходимую запись
    const todoIndex = localStorageTodos.findIndex((todo) => todo.id === todoId);
    localStorageTodos[todoIndex].done = !localStorageTodos[todoIndex].done;
    //записываем новый массив в localStorage
    localStorage.setItem("todosStorage", JSON.stringify(localStorageTodos));
  }
  //вызываем функцию рендера для обновления списка
  renderTodos();
};

const deleteTodo = (todoId) => {
  //получаем текущее значение из localStorage
  const localStorageTodos = getTodos();
  //проверка на то, что localStorage имеет такой объект и он является массивом
  if (localStorageTodos && Array.isArray(localStorageTodos)) {
    //фильтруем массив, удаляя необходимую запись
    const newTodos = localStorageTodos.filter((todo) => todo.id !== todoId);
    //записываем новый массив в localStorage
    localStorage.setItem("todosStorage", JSON.stringify(newTodos));
  }
  //вызываем функцию рендера для обновления списка
  renderTodos();
};

renderTodos();

const createForm = document.querySelector("#create-form");
const floaBbutton = document.querySelector(".float-button");
const closeFormButton = document.querySelector(".close-form-button");

floaBbutton.addEventListener("click", () => {
  createForm.style.display = "flex";
  floaBbutton.style.display = "none";
});

closeFormButton.addEventListener("click", () => {
  floaBbutton.style.display = "flex";
  createForm.style.display = "none";
});

// -------------------

const searchFieldInput = document.querySelector(".search-field__input");
if (searchFieldInput) {
  searchFieldInput.addEventListener("input", (event) => {
    currentSearch = event.target.value;
    renderTodos();
  });
}
