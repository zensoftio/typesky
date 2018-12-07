import {TodoRecordStorage} from '../index'
import Todo from '../../models/todo'
import DefaultRecordStorage from '../../common/storages/base/default'
import {action} from 'mobx'
import {storage} from '../../common/annotations/dependency-injection'

@storage('Todo')
export default class DefaultTodoRecordStorage extends DefaultRecordStorage<Todo.Records> implements TodoRecordStorage {

  @action
  getAll(): Todo.ModelList {
    return this.getWithDefault('all', {}, Todo.ModelList)._
  }

  @action
  addNewToAllList(todo: Todo.Model): this {
    const modelList = this.getWithDefault('all', {}, Todo.ModelList)._
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
