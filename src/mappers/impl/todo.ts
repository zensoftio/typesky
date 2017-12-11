import {computed} from 'mobx'
import {TodoMapper} from '../index'
import {TodoStore} from '../../stores'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import Todo from '../../models/todo'

@injectable('TodoMapper')
export default class DefaultTodoMapper implements TodoMapper {
  constructor(@injectOnProperty('TodoStore') protected repository: TodoStore) {
  
  }
  
  @computed
  get all(): Todo.Model[] {
    const result = this.repository.get('all').result
    return result ? result.list : []
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
