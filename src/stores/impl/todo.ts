import {TodoStore} from '../index'
import {injectable} from '../../common/annotations/common'
import BaseResultStore from '../base/impl/result'
import {TodoResults} from '../../results/index'
import TodoModel from '../../models/todo'
import {action} from 'mobx'
import {patch} from '../../common/utils/common'

@injectable('TodoStore')
export class DefaultTodoStore extends BaseResultStore<TodoResults> implements TodoStore {
  
  @action
  toggleTodo(todo: TodoModel) {
    // update model
    patch(todo, {finished: !todo.finished})
  }
}
