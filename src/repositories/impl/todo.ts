import {TodoRepository} from '../index'
import {injectable} from '../../common/annotations/common'
import QueryBaseRepository from '../base/impl/query'
import {TodoMapping} from '../../mappings/index'
import TodoModel from '../../models/todo'
import {action} from 'mobx'

@injectable('TodoRepository')
export class DefaultTodoRepository extends QueryBaseRepository<TodoMapping> implements TodoRepository {
  
  @action
  toggleTodo(todo: TodoModel) {
    // update model
    todo.fromJson({finished: !todo.finished})
  }
}
