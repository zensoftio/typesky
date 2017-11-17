import {TodoService} from '../index'
import TodoModel from '../../models/todo'
import {TodoRepository} from '../../repositories/index'
import {defaultTodoRepository} from '../../repositories/impl/todo'

export default class DefaultTodoService implements TodoService {
  private repository: TodoRepository
  
  constructor() {
    this.repository = defaultTodoRepository
  }
  
  createNew() {
    const name = Math.random()
                     .toString()
    this.repository.add(new TodoModel(name))
  }
  
  toggleTodo(todo: TodoModel) {
    this.repository.update(todo, {finished: !todo.finished})
  }
  
}
export const todoService = new DefaultTodoService()
