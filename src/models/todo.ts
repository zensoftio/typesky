import {observable} from 'mobx'
import UniqBaseModel from './base/uniq'

export default class TodoModel extends UniqBaseModel {
  
  @observable
  title = ''
  
  @observable
  finished = false
  
  constructor(id: number) {
    super()
    this.id = id
    this.title = id.toString()
  }
}
