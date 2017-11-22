import {PostResults, TodoResults} from '../results/index'
import {ResultStore} from './base/index'
import TodoModel from '../models/todo'

// here we need to list all implementations
export * from './impl/todo'
export * from './impl/post'

export interface TodoStore extends ResultStore<TodoResults> {
  toggleTodo(todo: TodoModel): void
}

export interface PostStore extends ResultStore<PostResults> {

}
