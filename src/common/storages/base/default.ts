import {action, observable} from 'mobx'
import {RecordStorage} from './index'
import {Injectable} from 'type-injector'

export class RecordContainer<T> {
  @observable
  _: T

  constructor(value?: T) {
    if (value) {
      this._ = value
    }
  }
}

export default class DefaultRecordStorage<T> implements RecordStorage<T>, Injectable {

  @observable
  protected map: Map<keyof T, RecordContainer<any>> = new Map()

  @action
  get<K extends keyof T>(key: K): RecordContainer<T[K]> {
    return this.getContainer(key)
  }

  @action
  getWithDefault<K extends keyof T>(key: K, defaultValue: T[K]): RecordContainer<T[K]> {
    const container = this.getContainer(key)
    const maybeValue = container._
    if (!maybeValue) {
      container._ = defaultValue
    }
    return container
  }

  @action
  set<K extends keyof T>(key: K, value: T[K]): this {
    const container = this.getContainer(key)
    container._ = value
    return this
  }

  @action
  clear(): void {
   this.map = new Map()
  }

  @action
  getContainer<K extends keyof T>(key: K): RecordContainer<T[K]> {
    const maybeRecord = this.map.get(key)
    if (!maybeRecord) {
      this.map.set(key, new RecordContainer())
    }
    const record = this.map.get(key)
    if (!record) {
      throw new Error(`there is no record for ${key}`)
    }
    return record
  }

  postConstructor() {
  }

  awakeAfterInjection() {
  }
}
