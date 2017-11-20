import {action, observable} from 'mobx'

export default class StateBaseRepository {
  
  @observable
  map: Map<string, Object> = new Map()
  
  @action
  getWithDefault(stateName: string, defaultState: Object) {
    if (!this.map.has(stateName)) {
      this.map.set(stateName, defaultState)
    }
    return this.map.get(stateName) as any
  }
  
  @action
  add(stateName: string, state: Object) {
    this.map.set(stateName, state)
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
