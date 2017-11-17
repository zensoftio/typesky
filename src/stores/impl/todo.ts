import {computed} from 'mobx'
import {TodoStore} from '../index'
import {TodoRepository} from '../../repositories/index'
import {defaultTodoRepository} from '../../repositories/impl/todo'

export default class DefaultTodoStore implements TodoStore {
  
  private repository: TodoRepository
  
  constructor() {
    this.repository = defaultTodoRepository
  }
  
  @computed
  get all() {
    return this.repository.list
  }
  
  @computed
  get unfinishedTodoCount() {
    return this.all.filter(todo => !todo.finished).length
  }
  
  lastOne() {
    return this.all[this.all.length - 1]
  }
}

export const todoStore = new DefaultTodoStore()
