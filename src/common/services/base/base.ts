import {Injectable} from '../../annotations/dependency-injection'

export default class BaseService implements Injectable {
  postConstructor() {
  }

  awakeAfterInjection() {
  }
}
