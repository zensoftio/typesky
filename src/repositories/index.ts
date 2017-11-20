import {PostMapping, TodoMapping} from '../mappings/index'
import {QueryRepository} from './base/index'

// here we need to list all implementations
export * from './impl/todo'
export * from './impl/post'

export interface TodoRepository extends QueryRepository<TodoMapping> {

}

export interface PostRepository extends QueryRepository<PostMapping> {

}
