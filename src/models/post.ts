import {observable} from 'mobx'
import UniqBaseModel from './base/uniq'

export default class PostModel extends UniqBaseModel {
  
  @observable
  userId: number
  
  @observable
  title: string
  
  @observable
  body: string
  
  constructor(title: string, body: string) {
    super()
    this.title = title
    this.body = body
  }
}
