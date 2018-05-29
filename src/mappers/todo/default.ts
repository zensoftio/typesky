import {computed} from 'mobx'
import {TodoMapper} from '../index'
import {injectConst, mapper} from '../../common/annotations/common'
import Todo from '../../models/todo'
import {TodoRecordStorage} from '../../storages'

@mapper('Todo')
export default class DefaultTodoMapper implements TodoMapper {
  constructor(@injectConst('TodoRecordStorage') protected store: TodoRecordStorage) {

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
