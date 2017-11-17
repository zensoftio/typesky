import {observable} from 'mobx'

export default class TodoModel {
  id = Math.random()
  
  @observable
  title = ''
  
  @observable
  finished = false
  
  constructor(title: string) {
    this.title = title
  }
}
