import {computed} from 'mobx'
import {TodoStore} from '../index'
import {TodoRepository} from '../../repositories/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import TodoModel from '../../models/todo'

@injectable('TodoStore')
export default class DefaultTodoStore implements TodoStore {
  constructor(@injectOnProperty('TodoRepository') protected repository: TodoRepository) {
  
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
