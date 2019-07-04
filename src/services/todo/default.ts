import {TodoService} from '../index';
import Todo from '../../models/todo';
import BaseService from '../../common/services/base/base';
import {TodoRecordStorage} from '../../storages';
import {injectConstructor, service} from '../../common/annotations/dependency-injection';

@service('Todo')
export default class DefaultTodoService extends BaseService implements TodoService {

  constructor(@injectConstructor('TodoRecordStorage') private store: TodoRecordStorage) {
    super()
  }

  createNew() {
    const todo = this.store.newModel();
    this.store.set('lastTodo', todo);
    this.store.addNewToAllList(todo);
  }

  toggleTodo(todo: Todo.Model) {
    this.store.toggleTodo(todo);
  }
}
