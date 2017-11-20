import {BaseRepository} from '../../index'
import {action, computed, observable} from 'mobx'
import UniqBaseModel from '../../../models/base/uniq'

export default class UniqBaseRepository<T extends UniqBaseModel> implements BaseRepository<T> {
  
  @observable
  private map: Map<T['id'], T> = new Map()
  
  @computed
  get list(): T[] {
    return Array.from(this.map.values())
  }
  
  @action
  add(model: T) {
    const originalModel = this.map.get(model.id)
    
    if (originalModel) {
      this.update(originalModel, model)
    } else {
      this.map.set(model.id, model)
    }
    
    return this
  }
  
  @action
  remove(model: T) {
    this.map.delete(model.id)
    return this
  }
  
  @action
  removeAll() {
    this.map.clear()
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