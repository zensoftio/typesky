import {computed} from 'mobx'
import {TodoMapper} from '../index'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import Todo from '../../models/todo'
import {TodoRecordStorage} from '../../storages'

@injectable('TodoMapper')
export default class DefaultTodoMapper implements TodoMapper {
  constructor(@injectOnProperty('TodoRecordStorage') protected store: TodoRecordStorage) {
  
  }
  
  @computed
  get all(): Todo.Model[] {
    const modelList = this.store.get('all')._
    return modelList ? modelList.list : []
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
