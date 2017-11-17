import {TodoService} from '../index'
import TodoModel from '../../models/todo'
import {TodoRepository} from '../../repositories/index'
import {injectable, injectOnProperty} from '../../annotations/common'

@injectable('TodoService')
export default class DefaultTodoService implements TodoService {
  
  constructor(@injectOnProperty('TodoRepository') private repository: TodoRepository) {
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
