import {Maybe} from '../../common/types'

export default interface ResultSet<T, K> {
  loading: boolean
  result: Maybe<T>
  error: Maybe<K>
}