import {PostMapping, TodoMapping} from '../mappings/index'
import {QueryRepository} from './base/index'
import TodoModel from '../models/todo'

// here we need to list all implementations
export * from './impl/todo'
export * from './impl/post'

export interface TodoRepository extends QueryRepository<TodoMapping> {
  toggleTodo(todo: TodoModel): void
}

export interface PostRepository extends QueryRepository<PostMapping> {

}
