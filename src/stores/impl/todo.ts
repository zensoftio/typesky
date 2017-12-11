import {TodoStore} from '../index'
import {injectable} from '../../common/annotations/common'
import BaseResultStore from '../base/impl/result'
import {TodoResults} from '../../results'
import Todo from '../../models/todo'
import {action} from 'mobx'
import {patch} from '../../common/utils/common'

@injectable('TodoStore')
export class DefaultTodoStore extends BaseResultStore<TodoResults> implements TodoStore {
  
  @action
  toggleTodo(todo: Todo.Model) {
    // update model
    patch(todo, {finished: !todo.finished})
  }
}
