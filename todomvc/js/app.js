var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var myapp;
(function (myapp) {
    var Storage = (function () {
        function Storage() {
        }
        Storage.fetch = function () {
            return JSON.parse(localStorage.getItem(Storage.STORAGE_KEY) || '[]');
        };

        Storage.save = function (todos) {
            localStorage.setItem(Storage.STORAGE_KEY, JSON.stringify(todos));
        };
        Storage.STORAGE_KEY = 'todos-vuejs';
        return Storage;
    })();
    myapp.Storage = Storage;

    var Filters = (function () {
        function Filters() {
        }
        Filters.all = function () {
            return true;
        };

        Filters.active = function (todo) {
            return !todo.completed;
        };

        Filters.completed = function (todo) {
            return todo.completed;
        };
        return Filters;
    })();
    myapp.Filters = Filters;

    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            //call super with false to defer compilation in Vue (dev build)
            _super.call(this, false);
            this.beforeEditCache = '';
            this.todos = myapp.Storage.fetch();
            this.newTodo = '';
            this.editedTodo = null;
            this.filter = 'all';

            //call $init with vue configuration with references to class members
            this.$init({
                el: '#todoapp',
                ready: this.ready,
                data: {
                    beforeEditCache: this.beforeEditCache,
                    todos: this.todos,
                    newTodo: this.newTodo,
                    editedTodo: this.editedTodo,
                    filter: this.filter
                },
                directives: {
                    'todo-focus': this.todoFocus
                },
                filters: {
                    filterTodos: this.filterTodos
                },
                computed: {
                    remaining: this._remaining,
                    allDone: {
                        $get: this._allDone_get,
                        $set: this._allDone_set
                    }
                },
                methods: {
                    addTodo: this.addTodo,
                    removeTodo: this.removeTodo,
                    editTodo: this.editTodo,
                    doneEdit: this.doneEdit,
                    cancelEdit: this.cancelEdit,
                    removeCompleted: this.removeCompleted
                }
            });
        }
        //ready handler
        App.prototype.ready = function () {
            this.$watch('todos', function (todos) {
                myapp.Storage.save(todos);
            });
        };

        //directive todoFocus
        App.prototype.todoFocus = function (value) {
            if (!value) {
                return;
            }
            var el = this.el;
            setTimeout(function () {
                el.focus();
            }, 0);
        };

        //filters filterTodos remapped to 'filter-todos' in $init
        App.prototype.filterTodos = function (todos) {
            return todos.filter(Filters[this.filter]);
        };

        App.prototype._remaining = function () {
            return this.todos.filter(Filters.active).length;
        };

        App.prototype._allDone_get = function () {
            return this.remaining === 0;
        };
        App.prototype._allDone_set = function (value) {
            this.todos.forEach(function (todo) {
                todo.completed = value;
            });
        };

        //method addTodo
        App.prototype.addTodo = function () {
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.todos.push({ title: value, completed: false });
            this.newTodo = '';
        };

        //method removeTodo
        App.prototype.removeTodo = function (todo) {
            this.todos.$remove(todo.$data);
        };

        //method editTodo
        App.prototype.editTodo = function (todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        };

        //method doneEdit
        App.prototype.doneEdit = function (todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            }
        };

        //method cancelEdit
        App.prototype.cancelEdit = function (todo) {
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        };

        //method removeCompleted
        App.prototype.removeCompleted = function () {
            this.todos = this.todos.filter(Filters.active);
        };
        return App;
    })(Vue);
    myapp.App = App;

    //create
    myapp.app = new App();

    myapp.router = new Router();

    myapp.router.on('all', function () {
        myapp.app.filter = 'all';
    });

    myapp.router.on('active', function () {
        myapp.app.filter = 'active';
    });

    myapp.router.on('completed', function () {
        myapp.app.filter = 'completed';
    });

    myapp.router.configure({
        notfound: function () {
            window.location.hash = '';
            myapp.app.filter = 'all';
        }
    });

    myapp.router.init();
})(myapp || (myapp = {}));
