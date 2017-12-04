import {action, observable} from 'mobx'
import {ResultStore} from '../index'
import ResultSet from '../../../results/base/props'
import BaseResultSet from '../../../results/base/result'
import InjectableLifecycle from '../../../common/injectable-lifecycle'

export default class BaseResultStore<T> implements ResultStore<T>, InjectableLifecycle {
  @observable
  map: Map<string, ResultSet<any, any>> = new Map()
  
  @action
  get<K extends keyof T>(queryName: K): T[K] {
    return this.getByName(queryName) as any
  }
  
  @action
  prepare<K extends keyof T>(queryName: K): T[K] {
    return this.getByName(queryName)
               .clearResult()
               .clearError() as any
  }
  
  @action
  load<K extends keyof T>(queryName: K, result: any): T[K] {
    return this.getByName(queryName)
               .loadResult(result) as any
  }
  
  @action
  setError<K extends keyof T>(queryName: K, error: any): T[K] {
    return this.getByName(queryName)
               .setError(error) as  any
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
  
  postConstructor() {
    return Promise.resolve()
  }
  
  onReady() {
    return Promise.resolve()
  }
  
  @action
  private getByName<K extends keyof T>(queryName: K): BaseResultSet<any, any> {
    if (!this.map.has(queryName)) {
      this.map.set(queryName, new BaseResultSet())
    }
    
    const resultSet = this.map.get(queryName)
    if (!resultSet) {
      throw new Error(`there is no ResultSet for ${queryName}`)
    }
    return resultSet as BaseResultSet<any, any>
  }
}