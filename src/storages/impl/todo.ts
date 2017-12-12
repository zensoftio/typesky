import {TodoRecordStorage} from '../index'
import Todo from '../../models/todo'
import DefaultRecordStorage from '../base/default'
import {injectable} from '../../common/annotations/common'
import {action} from 'mobx'
import {instantiateJson} from '../../common/annotations/model'

@injectable('TodoRecordStorage')
export default class DefaultTodoRecordStorage extends DefaultRecordStorage<Todo.Records> implements TodoRecordStorage {
  
  @action
  addNewToAllList(todo: Todo.Model): this {
    const maybeModelList = this.get('all')._
    const modelList = maybeModelList || instantiateJson<Todo.ModelList>(maybeModelList, Todo.ModelList)
    this.set('all', modelList)
    
    modelList.list.push(todo)
    return this
  }
  
  @action
  newModel(): Todo.Model {
    return Todo.Model.of(Math.random())
  }
  
  @action
  toggleTodo(todo: Todo.Model) {
    todo.finished = !todo.finished
    return this
  }
  
}
