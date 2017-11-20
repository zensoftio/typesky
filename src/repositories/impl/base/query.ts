import {action, observable} from 'mobx'
import ResultSet from '../../../common/result'

export default class QueryBaseRepository {
  
  @observable
  map: Map<string, ResultSet<any>> = new Map()
  
  @action
  get(queryName: string) {
    if (!this.map.has(queryName)) {
      this.map.set(queryName, new ResultSet())
    }
    return this.map.get(queryName) as ResultSet<any>
  }
  
  @action
  add(queryName: string, result?: any) {
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
      resultSet.loading = true
    }
    
    return resultSet
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