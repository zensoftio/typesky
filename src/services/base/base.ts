import InjectableLifecycle from '../../common/injectable-lifecycle'

export default class BaseService implements InjectableLifecycle {
  postConstructor() {
    return Promise.resolve()
  }
  
  onReady() {
    return Promise.resolve()
  }
}