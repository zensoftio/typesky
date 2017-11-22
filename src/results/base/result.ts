import {observable} from 'mobx'

export default class ResultSet<T> {
  
  @observable
  loading: boolean = true
  
  @observable
  result?: T
  
  loadResult(result: T) {
    this.loading = false
    this.result = result
  }
  
  clearResult() {
    this.loading = true
    this.result = undefined
  }
}