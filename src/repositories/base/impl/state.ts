import {action, observable} from 'mobx'
import {StateRepository} from '../index'
import {BaseMapping} from '../../../mappings/base/index'

export default class StateBaseRepository<T extends BaseMapping> implements StateRepository<T> {
  
  @observable
  map: Map<string, Object> = new Map()
  
  @action
  getWithDefault<K extends keyof T>(stateName: K, defaultState?: any): T[K] {
    if (!this.map.has(stateName)) {
      this.map.set(stateName, defaultState)
    }
    return this.map.get(stateName)
  }
  
  @action
  add<K extends keyof T>(stateName: K, state: any): T[K] {
    this.map.set(stateName, state)
    return this.map.get(stateName)
  }
  
  @action
  remove(queryName: string) {
    this.map.delete(queryName)
    return this
  }
  
  @action
  removeAll() {
    this.map.clear()
    return this
  }
}
