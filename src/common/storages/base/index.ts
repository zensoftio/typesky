import {RecordContainer} from './default'

export interface RecordStorage<T> {
  get<K extends keyof T>(key: K): Partial<RecordContainer<T[K]>>
  
  getWithDefault<K extends keyof T>(key: K, defaultValue: Partial<T[K]>, constructor: any): RecordContainer<T[K]>
  
  set<K extends keyof T>(key: K, value: T[K]): this
}
