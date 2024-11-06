class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.form = document.getElementById('todoForm');
        this.todoList = document.getElementById('todoList');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.renderTodos();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    handleSubmit(e) {
        e.preventDefault();
        const titleInput = document.getElementById('todoTitle');
        const dueDateInput = document.getElementById('datepicker-autohide');

        if (!titleInput.value || !dueDateInput.value) {
            alert('Please fill in all fields');
            return;
        }

        const todo = {
            id: Date.now(),
            title: titleInput.value,
            createdAt: new Date().toISOString(),
            dueDate: new Date(dueDateInput.value).toISOString(),
            completed: false
        };

        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();

        titleInput.value = '';
        dueDateInput.value = '';
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }

    editTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            const newTitle = prompt('Edit todo:', todo.title);
            if (newTitle !== null && newTitle.trim() !== '') {
                todo.title = newTitle;
                this.saveTodos();
                this.renderTodos();
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        
        const getSuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).replace(/(\d+)/, `$1${getSuffix(day)}`);
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        
        this.todos.forEach(todo => {
            const row = document.createElement('tr');
            row.className = 'border-b bg-gray-800 border-gray-700 hover:bg-gray-600';
            
            row.innerHTML = `
                <th scope="row" class="px-1.5 py-2 md:px-6 md:py-3 font-medium whitespace-nowrap ${todo.completed ? 'line-through text-gray-400' : 'text-white'}">
                    ${todo.title}
                </th>
                <td class="px-1.5 py-2 md:px-6 md:py-3">
                    ${this.formatDate(todo.createdAt)}
                </td>
                <td class="px-1.5 py-2 md:px-6 md:py-3">
                    ${this.formatDate(todo.dueDate)}
                </td>
                <td class="px-1.5 py-2 md:px-6 md:py-3">
                    ${todo.completed ? 'Done' : 'Not Done'}
                </td>
                <td class="px-1.5 py-2 md:px-6 md:py-3 text-right">
                    <button onclick="todoApp.toggleTodo(${todo.id})" 
                            class="font-medium text-green-500 hover:text-green-300 px-2">
                        <i class="bi bi-check-circle${todo.completed ? '-fill' : ''}"></i>
                    </button>
                    <button onclick="todoApp.editTodo(${todo.id})" 
                            class="font-medium text-yellow-500 hover:text-yellow-300 px-2">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button onclick="todoApp.deleteTodo(${todo.id})" 
                            class="font-medium text-red-500 hover:text-red-300 px-2">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            this.todoList.appendChild(row);
        });
    }
}

// Initialize the app
const todoApp = new TodoApp();