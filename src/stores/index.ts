import {PostResults, TodoResults} from '../results/index'
import {ResultStore} from './base/index'
import TodoModel from '../models/todo'

export interface TodoStore extends ResultStore<TodoResults> {
  toggleTodo(todo: TodoModel): void
}

export interface PostStore extends ResultStore<PostResults> {

}
