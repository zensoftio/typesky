import {computed} from 'mobx'
import {TodoMapper} from '../index'
import Todo from '../../models/todo'
import {TodoRecordStorage} from '../../storages'
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection'

@mapper('Todo')
export default class DefaultTodoMapper implements TodoMapper {
  constructor(@injectConstructor('TodoRecordStorage') protected store: TodoRecordStorage) {

  }

  @computed
  get all(): Todo.Model[] {
    return this.store.getAll().list
  }

  @computed
  get unfinishedTodoCount(): number {
    return this.all.filter(it => !it.finished).length
  }

  @computed
  get lastOne() {
    return this.store.get('lastTodo')._
  }
}
