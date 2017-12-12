import TodoView from './todo'
import * as React from 'react'
import {observer} from 'mobx-react'
import Todo from '../models/todo'
import {PostService, TodoService} from '../services'
import {PostMapper, TodoMapper} from '../mappers'
import {instanceRegistry} from '../common/annotations/common'

@observer
export default class TodoListView extends React.Component<{}, {}> {
  
  // fields
  
  private postId = 1
  
  private todoService: TodoService = instanceRegistry.get('TodoService')
  private postService: PostService = instanceRegistry.get('PostService')
  private todoMapper: TodoMapper = instanceRegistry.get('TodoMapper')
  private postMapper: PostMapper = instanceRegistry.get('PostMapper')
  
  // constructor
  
  // life circle
  
  componentDidMount() {
    this.loadPost()
  }
  
  // handlers
  
  onCreateNewButtonClick = () => {
    this.create()
  }
  
  onTodoCheckboxClick = (todo: Todo.Model) => {
    this.toggleCheckbox(todo)
  }
  
  onReloadPostButtonClick = () => {
    this.loadPost()
  }
  
  // render
  
  render() {
    const todoLast = this.todoMapper.lastOne
    const single = this.postMapper.postById
    return (
      <div>
        <button onClick={this.onCreateNewButtonClick}>create new</button>
        <button onClick={this.onReloadPostButtonClick}>reload post</button>
        <ul>
          
          {single && (
            <div key={single.id}>
              <div>{single.title}</div>
              <div>{single.body}</div>
              <div>{single.userId}</div>
            </div>
          )}
          
          {this.todoMapper.all.map(todo =>
                                    <TodoView todo={todo} key={todo.id} onClick={() => this.onTodoCheckboxClick(todo)}/>
          )}
          
          {todoLast && <TodoView todo={todoLast} key={todoLast.id} onClick={() => this.onTodoCheckboxClick(todoLast)}/>}
        
        </ul>
        Tasks left: {this.todoMapper.unfinishedTodoCount}
      </div>
    )
  }
  
  // private methods
  
  private create() {
    this.todoService.createNew()
  }
  
  private toggleCheckbox(todo: Todo.Model) {
    this.todoService.toggleTodo(todo)
  }
  
  private loadPost() {
    this.postId++
    return this.postService.loadPost(this.postId)
  }
}
