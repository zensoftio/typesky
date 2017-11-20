import {BaseRepository} from '../../index'
import {action, observable} from 'mobx'
import SimpleBaseModel from '../../../models/base/simple'

export default class SimpleBaseRepository<T extends SimpleBaseModel> implements BaseRepository<T> {
  
  @observable
  list: T[] = []
  
  @action
  add(model: T) {
    if (!this.list.includes(model)) {
      this.list.push(model)
    }
    return this
  }
  
  @action
  remove(model: T) {
    if (this.list.includes(model)) {
      this.list.splice(this.list.indexOf(model), 1)
    }
    return this
  }
  
  @action
  removeAll() {
    this.list = []
    return this
  }
  
  @action
  update(model: T, changes: Partial<T>) {
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        (model as Partial<T>)[key] = changes[key]
      }
    }
    return this
  }
}