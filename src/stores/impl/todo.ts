import {computed} from 'mobx'
import {TodoStore} from '../index'
import {TodoRepository} from '../../repositories/index'
import {injectable, injectOnProperty} from '../../annotations/common'

@injectable('TodoStore')
export default class DefaultTodoStore implements TodoStore {
  
  constructor(@injectOnProperty('TodoRepository') private repository: TodoRepository) {
    console.log(this.repository)
  }
  
  @computed
  get all() {
    return this.repository.list
  }
  
  @computed
  get unfinishedTodoCount() {
    return this.all.filter(todo => !todo.finished).length
  }
  
  @computed
  get lastOne() {
    return this.all[this.all.length - 1]
  }
}
