import TodoView from './todo'
import * as React from 'react'
import {observer} from 'mobx-react'
import {todoService} from '../services/impl/todo'
import {todoStore} from '../stores/impl/todo'
import TodoModel from '../models/todo'
import {TodoService} from '../services/index'
import {TodoStore} from '../stores/index'

@observer
export default class TodoListView extends React.Component<{}, {}> {
  
  // fields
  
  private todoService: TodoService
  private todoStore: TodoStore
  
  // constructor
  
  constructor(props: {}, context?: any) {
    super(props, context)
    this.todoService = todoService
    this.todoStore = todoStore
  }
  
  // life circle
  
  // handlers
  
  onCreateNewButtonClick = () => {
    this.create()
  }
  
  onTodoCheckboxClick = (todo: TodoModel) => {
    this.toggleCheckbox(todo)
  }
  
  // render
  
  render() {
    const todoLast: TodoModel = this.todoStore.lastOne()
    return (
      <div>
        <button onClick={this.onCreateNewButtonClick}>create new</button>
        <ul>
          
          {this.todoStore.all.map(todo =>
                                    <TodoView todo={todo} key={todo.id} onClick={() => this.onTodoCheckboxClick(todo)}/>
          )}
          
          {todoLast && <TodoView todo={todoLast} key={todoLast.id} onClick={() => this.onTodoCheckboxClick(todoLast)}/>}
        
        </ul>
        Tasks left: {this.todoStore.unfinishedTodoCount}
      </div>
    )
  }
  
  // private methods
  
  private create() {
    this.todoService.createNew()
  }
  
  private toggleCheckbox(todo: TodoModel) {
    this.todoService.toggleTodo(todo)
  }
}