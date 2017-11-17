import {observable} from 'mobx'
import BaseModel from './base/model'

export default class TodoModel extends BaseModel {
  id = Math.random()
  
  @observable
  title = ''
  
  @observable
  finished = false
  
  constructor(title: string) {
    super()
    this.title = title
  }
}
