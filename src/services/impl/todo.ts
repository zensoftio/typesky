import {TodoService} from '../index'
import TodoModel from '../../models/todo'
import {TodoRepository} from '../../repositories/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'

@injectable('TodoService')
export default class DefaultTodoService implements TodoService {
  
  constructor(@injectOnProperty('TodoRepository') private repository: TodoRepository) {
  }
  
  createNew() {
    const name = Math.random().toString()
    const todo = new TodoModel(name)
    
    // simple add for sync operations
    this.repository.add('lastTodo', todo)
    
    // container doesn't guarantee result for existence
    const all = this.repository.get('all')
    all.loadResult(all.result ? [...all.result, todo] : [])
  }
  
  toggleTodo(todo: TodoModel) {
    // update model
    todo.fromJson({...todo.toJson(), finished: !todo.finished})
  }
  
}
