import {TodoService} from '../index'
import Todo from '../../models/todo'
import {TodoStore} from '../../stores'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import BaseService from '../base/base'

@injectable('TodoService')
export default class DefaultTodoService extends BaseService implements TodoService {
  
  constructor(@injectOnProperty('TodoStore') private store: TodoStore) {
    super()
  }
  
  createNew() {
    const name = Math.random()
    
    const todo = Todo.Model.of(name)
    
    // simple load for sync operations
    this.store.load('lastTodo', todo)
    
    // container doesn't guarantee result for existence
    const all = this.store.get('all')
    this.store.load('all', {list: all.result ? [...all.result.list, todo] : []})
  }
  
  toggleTodo(todo: Todo.Model) {
    this.store.toggleTodo(todo)
  }
  
}
