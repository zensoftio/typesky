import {TodoService} from '../index'
import TodoModel from '../../models/todo'
import {TodoStore} from '../../stores'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import BaseService from '../base/base'

@injectable('TodoService')
export default class DefaultTodoService extends BaseService implements TodoService {
  
  constructor(@injectOnProperty('TodoStore') private repository: TodoStore) {
    super()
  }
  
  createNew() {
    const name = Math.random()
    
    const todo = new TodoModel(name)
    
    // simple load for sync operations
    this.repository.load('lastTodo', todo)
    
    // container doesn't guarantee result for existence
    const all = this.repository.get('all')
    this.repository.load('all', {list: all.result ? [...all.result.list, todo] : []})
  }
  
  toggleTodo(todo: TodoModel) {
    this.repository.toggleTodo(todo)
  }
  
}
