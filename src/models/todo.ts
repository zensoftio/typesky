import {observable} from 'mobx'
import {attr} from '../common/annotations/model'

namespace Todo {
  export class Model {
    @attr()
    @observable
    id: number
    
    @attr()
    @observable
    title = ''
    
    @attr()
    @observable
    finished = false
    
    static of(id: number) {
      const model = new Model()
      model.id = id
      model.title = id.toString()
      return model
    }
  }
}

export default Todo
