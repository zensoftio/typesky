import {action, observable} from 'mobx'

export default class ResultSet<T> {
  
  @observable
  loading: boolean = true
  
  @observable
  result?: T
  
  @action
  loadResult(result: T) {
    this.loading = false
    this.result = result
  }
}