import ResultSet from '../../common/result'


export interface StateRepository<T> {
  map: Map<string, Object>
  
  getWithDefault<K extends keyof T>(stateName: K, defaultState?: any): T[K]
  
  add<K extends keyof T>(stateName: K, state: any): T[K]
  
  remove(queryName: string): this
  
  removeAll(): this
}

export interface QueryRepository<T> {
  map: Map<string, ResultSet<any>>
  
  get<K extends keyof T>(queryName: K): T[K]
  
  add<K extends keyof T>(queryName: K, result?: any): T[K]
  
  remove(queryName: string): this
  
  removeAll(): this
}