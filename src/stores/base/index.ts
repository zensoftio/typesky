import ResultSet from '../../results/base/result'


export interface SimpleStore<T> {
  map: Map<string, Object>
  
  getWithDefault<K extends keyof T>(stateName: K, defaultState?: any): T[K]
  
  add<K extends keyof T>(stateName: K, state: any): T[K]
  
  remove(queryName: string): this
  
  removeAll(): this
}

export interface ResultStore<T> {
  map: Map<string, ResultSet<any>>
  
  get<K extends keyof T>(queryName: K): T[K]
  
  add<K extends keyof T>(queryName: K, result?: any): T[K]
  
  remove(queryName: string): this
  
  removeAll(): this
}