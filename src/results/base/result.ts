import {observable} from 'mobx'
import {Maybe} from '../../common/types'

export default class ResultSet<T, K> {
  
  @observable
  loading: boolean = true
  
  @observable
  result: Maybe<T>
  
  @observable
  error: Maybe<K>
  
  loadResult(result: T) {
    this.loading = false
    this.result = result
    return this
  }
  
  clearResult() {
    this.loading = true
    this.result = null
    return this
  }
  
  clearError() {
    this.error = null
    return this
  }
  
  setError(error: K) {
    this.loading = false
    this.error = error
    return this
  }
}