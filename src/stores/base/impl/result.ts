import {action, observable} from 'mobx'
import ResultSet from '../../../results/base/result'
import {ResultStore} from '../index'

export default class BaseResultStore<T> implements ResultStore<T> {
  
  @observable
  map: Map<string, ResultSet<any>> = new Map()
  
  @action
  get<K extends keyof T>(queryName: K): T[K] {
    if (!this.map.has(queryName)) {
      this.map.set(queryName, new ResultSet())
    }
    const resultSet = this.map.get(queryName)
    if (!resultSet) {
      throw new Error(`there is no ResultSet for ${queryName}`)
    }
    
    return resultSet as any
  }
  
  @action
  add<K extends keyof T>(queryName: K, result?: any): T[K] {
    if (!this.map.has(queryName)) {
      this.map.set(queryName, new ResultSet())
    }
    
    const resultSet = this.map.get(queryName)
    if (!resultSet) {
      throw new Error(`there is no ResultSet for ${queryName}`)
    }
    
    if (result) {
      resultSet.loadResult(result)
    } else {
      resultSet.clearResult()
    }
    
    return resultSet as any
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