import {TodoService} from '../index'
import Todo from '../../models/todo'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import BaseService from '../../common/services/base/base'
import {TodoRecordStorage} from '../../storages'

@injectable('TodoService')
export default class DefaultTodoService extends BaseService implements TodoService {
  
  constructor(@injectOnProperty('TodoRecordStorage') private store: TodoRecordStorage) {
    super()
  }
  
  createNew() {
    const todo = this.store.newModel()
    
    this.store.set('lastTodo', todo)
    
    this.store.addNewToAllList(todo)
  }
  
  toggleTodo(todo: Todo.Model) {
    this.store.toggleTodo(todo)
  }
  
}
