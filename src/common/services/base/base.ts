// import InjectableLifecycle from '../../injectable-lifecycle'
import {Injectable} from '../../annotations/dependency-injection'

export default class BaseService implements Injectable {
  postConstructor() {
    // return Promise.resolve()
  }

  awakeAfterInjection() {

  }

  // onReady() {
  //   return Promise.resolve()
  // }
}
