import InjectableLifecycle from '../../injectable-lifecycle'

export default class BaseService implements InjectableLifecycle {
  postConstructor() {
    return Promise.resolve()
  }
  
  onReady() {
    return Promise.resolve()
  }
}
