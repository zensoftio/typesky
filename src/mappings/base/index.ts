import ResultSet from '../../common/result'

export interface BaseMapping {
  [key: string]: any
}

export interface ResultBaseMapping extends BaseMapping {
  [key: string]: ResultSet<any>
}