import {observable} from 'mobx'
import UniqBaseModel from './base/uniq'

export default class TodoModel extends UniqBaseModel {
  
  @observable
  title = ''
  
  @observable
  finished = false
  
  constructor(title: string) {
    super()
    this.title = title
  }
}
