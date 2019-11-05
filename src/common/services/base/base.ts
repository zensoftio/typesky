import {Injectable} from 'type-injector'

export default class BaseService implements Injectable {
  postConstructor() {
  }

  awakeAfterInjection() {
  }
}
