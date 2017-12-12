import {RecordContainer} from './default'

export interface RecordStorage<T> {
  get<K extends keyof T>(key: K, defaultValue?: T[K]): RecordContainer<T[K]>
  
  set<K extends keyof T>(key: K, value: T[K]): this
}
