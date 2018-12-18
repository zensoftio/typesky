import {action, observable} from 'mobx'
import {RecordStorage} from './index'
import {instantiateJson} from '../../annotations/model'
import {Injectable} from '../../annotations/dependency-injection'

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
  private map: Map<string, RecordContainer<any>> = new Map()

  @action
  get<K extends keyof T>(key: K, defaultValue?: T[K]): Partial<RecordContainer<T[K]>> {
    return this.getContainer(key)
  }

  @action
  getWithDefault<K extends keyof T>(key: K, defaultValue: Partial<T[K]>, constructor: any): RecordContainer<T[K]> {
    const container = this.getContainer(key)
    const maybeValue = container._
    if (!maybeValue) {
      container._ = instantiateJson(defaultValue, constructor)
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
  private getContainer<K extends keyof T>(key: K): RecordContainer<T[K]> {
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

  postConstructor() { }

  awakeAfterInjection() { }
}
