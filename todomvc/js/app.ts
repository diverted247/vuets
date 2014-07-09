module myapp {


    export class Storage {

        static STORAGE_KEY = 'todos-vuejs';
        
        static fetch() {
            return JSON.parse( localStorage.getItem( Storage.STORAGE_KEY ) || '[]' );
        }

        static save( todos ){
            localStorage.setItem( Storage.STORAGE_KEY , JSON.stringify( todos ) );
        }
    }


    export class Filters{

        static all(){
            return true;
        }
        
        static active( todo ){
            return !todo.completed;
        }

        static completed( todo ){
            return todo.completed;
        }
    }

    export class App extends Vue{

        constructor(){
            //call super with false to defer compilation in Vue (dev build)
            super( false );
            
            //call $init with vue configuration with references to class members
            this.$init( {
                el: '#todoapp',
                ready: this.ready,
                data:{
                    beforeEditCache: this.beforeEditCache,
                    todos: this.todos,
                    newTodo: this.newTodo,
                    editedTodo: this.editedTodo,
                    filter: this.filter
                },
                directives:{
                    'todo-focus': this.todoFocus
                },
                filters:{
                    filterTodos: this.filterTodos
                },
                computed:{
                    remaining: this._remaining,
                    allDone: {
                        $get: this._allDone_get,
                        $set: this._allDone_set
                    }
                },
                methods:{
                    addTodo: this.addTodo,
                    removeTodo: this.removeTodo,
                    editTodo: this.editTodo,
                    doneEdit: this.doneEdit,
                    cancelEdit: this.cancelEdit,
                    removeCompleted: this.removeCompleted
                }
            });
        }

        //members
        el:HTMLElement;
        beforeEditCache:string = '';
        todos:any[] = myapp.Storage.fetch();
        newTodo:string = '';
        editedTodo:any = null;
        filter:string = 'all';

        //ready handler
        ready(){
            this.$watch( 'todos' , function( todos ){
                myapp.Storage.save( todos );
            });
        }

        //directive todoFocus
        todoFocus( value ){
            if( !value ){
                return;
            }
            var el = this.el;
            setTimeout( function (){
                el.focus();
            } , 0 );
        }


        //filters filterTodos remapped to 'filter-todos' in $init
        filterTodos( todos ){
            return todos.filter( Filters[ this.filter ] );
        }

        //computed remaining
        remaining:number;
        _remaining(){
            return this.todos.filter( Filters.active ).length;
        }

        //computed allDone
        allDone:boolean;
        _allDone_get(){
            return this.remaining === 0;
        }
        _allDone_set( value ){
            this.todos.forEach( function( todo ){
                todo.completed = value;
            });
        }


        //method addTodo
        addTodo(){
            var value = this.newTodo && this.newTodo.trim();
            if ( !value ) {
                return;
            }
            this.todos.push( { title: value, completed: false } );
            this.newTodo = '';
        }

        //method removeTodo
        removeTodo( todo ){
            this.todos.$remove( todo.$data );
        }

        //method editTodo
        editTodo( todo ){
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        }

        //method doneEdit
        doneEdit( todo ){
            if( !this.editedTodo ){
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if( !todo.title ){
                this.removeTodo( todo );
            }
        }

        //method cancelEdit
        cancelEdit( todo ){
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        }

        //method removeCompleted
        removeCompleted(){
            this.todos = this.todos.filter( Filters.active );
        }
    }

    //create 
    export var app = new App();

    export var router = new Router();

    router.on( 'all' , function () {
        app.filter = 'all';
    });

    router.on( 'active' , function () {
        app.filter = 'active';
    });

    router.on( 'completed' , function () {
        app.filter = 'completed';
    });

    router.configure({
        notfound: function () {
            window.location.hash = '';
            myapp.app.filter = 'all';
        }
    });

    router.init();

}