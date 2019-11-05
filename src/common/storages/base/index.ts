import {Injectable} from 'type-injector'
import {RecordContainer} from './default'

export interface RecordStorage<T> extends Injectable {
  get<K extends keyof T>(key: K): RecordContainer<T[K]>

  getWithDefault<K extends keyof T>(key: K, defaultValue: T[K]): RecordContainer<T[K]>

  set<K extends keyof T>(key: K, value: T[K]): this

  clear(): void
}
