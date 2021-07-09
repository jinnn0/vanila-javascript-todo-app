// DOM elements
const formInput = document.querySelector('form input');
const formSubmitButton = document.querySelector('form button');
const todoList = document.querySelector('.todo-list');
const filterBtns = document.querySelector('.filter-btns');

// Event Listneres
window.addEventListener('load', displayInitialTodos);
formSubmitButton.addEventListener('click', addTodo);
todoList.addEventListener('click', completeOrDelete);
filterBtns.addEventListener('click', filterTodos);

// Initial todos
const todos = JSON.parse(localStorage.getItem('todos')) || [];

// Functions
function displayInitialTodos() {
  todos.forEach((todo) => displayTodo(todo));
}

function addTodo(e) {
  e.preventDefault();
  const value = formInput.value.trim();
  // If value is empty, return
  if (value.length === 0) return;

  const todo = { id: ++todos.length, task: value, completed: false };

  saveToLocalStorage(todo);
  displayTodo(todo);

  formInput.value = '';
  formInput.focus();
}

function displayTodo(todo) {
  // Create todo list item
  const li = document.createElement('li');
  li.className = `todo-item ${todo.id} ${todo.completed ? 'completed' : ''}`;

  // Create task span
  const span = document.createElement('span');
  span.className = 'task';
  span.innerText = todo.task;

  // Create buttons div
  const div = document.createElement('div');
  div.className = 'btns';
  div.innerHTML = '<i class="fas fa-check complete-btn"></i>  <i class="fas fa-trash delete-btn"></i>';

  // Append elements to the list item
  li.appendChild(span);
  li.appendChild(div);

  // Append it to the todo list
  todoList.appendChild(li);
}

function completeOrDelete(e) {
  const target = e.target;
  const todo = target.parentElement.parentElement;
  const id = Number(todo.classList[1]);

  switch (target.classList[2]) {
    case 'complete-btn':
      todo.classList.toggle('completed');

      updateLocalStorage(id);
      break;

    case 'delete-btn':
      todo.classList.add('fall');
      todo.addEventListener('transitionend', () => {
        todo.remove();
      });

      break;
  }
}

function filterTodos(e) {
  // Check clicked button
  const target = e.target;
  // Todo items
  const todos = todoList.childNodes;
  // Three filter buttons
  const buttons = [...filterBtns.children];

  // Check if there's previously clicked button
  let prveButton = buttons.find((btn) => btn.classList.contains('clicked')) || null;

  // If yes, remove styles from previously clicked button
  if (prveButton) {
    prveButton.classList.remove('clicked');
  }

  // Add styles to the currently clicked button
  target.classList.add('clicked');

  todos.forEach((todo) => {
    switch (target.classList[0]) {
      case 'completed':
        if (!todo.classList.contains('completed')) {
          todo.style.display = 'none';
        } else {
          todo.style.display = 'flex';
        }
        break;

      case 'uncompleted':
        if (!todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }
        break;

      case 'all':
        todo.style.display = 'flex';
        break;
    }
  });
}

// LocalStorage
function saveToLocalStorage(todo) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalStorage(id) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const newTodos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = todo.completed ? false : true;
    }

    return todo;
  });

  localStorage.setItem('todos', JSON.stringify(newTodos));
}
