import {computed} from 'mobx'
import {TodoMapper} from '../index'
import {TodoStore} from '../../stores/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import TodoModel from '../../models/todo'

@injectable('TodoMapper')
export default class DefaultTodoMapper implements TodoMapper {
  constructor(@injectOnProperty('TodoStore') protected repository: TodoStore) {
  
  }
  
  @computed
  get all(): TodoModel[] {
    return this.repository.get('all').result || []
  }
  
  @computed
  get unfinishedTodoCount(): number {
    return this.all.filter(it => !it.finished).length
  }
  
  @computed
  get lastOne() {
    return this.repository.get('lastTodo').result
  }
}
