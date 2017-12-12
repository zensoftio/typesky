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
    
    @attr({defaultValue: false})
    @observable
    finished: boolean
    
    static of(id: number) {
      const model = new Model()
      model.id = id
      model.title = id.toString()
      return model
    }
  }
  
  export class ModelList {
    @attr({type: Model, defaultValue: [], optional: true})
    @observable
    list: Model[]
  }
  
  export interface Records {
    lastTodo: Todo.Model
    all: ModelList
  }
}

export default Todo
