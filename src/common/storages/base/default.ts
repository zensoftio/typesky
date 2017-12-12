import {action, observable} from 'mobx'
import {RecordStorage} from './index'

export class RecordContainer<T> {
  @observable
  _?: T
  
  constructor(value?: T) {
    this._ = value
  }
}

export default class DefaultRecordStorage<T> implements RecordStorage<T> {
  
  @observable
  private map: Map<string, RecordContainer<any>> = new Map()
  
  @action
  get<K extends keyof T>(key: K, defaultValue?: T[K]): RecordContainer<T[K]> {
    return this.getContainer(key, defaultValue)
  }
  
  @action
  set<K extends keyof T>(key: K, value: T[K]): this {
    const container = this.getContainer(key)
    container._ = value
    return this
  }
  
  private getContainer<K extends keyof T>(key: K, defaultValue?: T[K]): RecordContainer<T[K]> {
    const maybeRecord = this.map.get(key)
    if (!maybeRecord) {
      this.map.set(key, new RecordContainer(defaultValue))
    }
    const record = this.map.get(key)
    if (!record) {
      throw new Error(`there is no record for ${key}`)
    }
    return record
  }
}
