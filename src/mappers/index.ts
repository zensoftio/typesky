import TodoModel from '../models/todo'
import PostModel from '../models/post'
import ResultSet from '../results/base/result'
import {Maybe} from '../common/types'

// here we need to list all implementations
export * from './impl/todo'
export * from './impl/post'

export interface TodoMapper {
  
  all: TodoModel[]
  
  unfinishedTodoCount: number
  
  lastOne: Maybe<TodoModel>
}

export interface PostMapper {
  
  postById: ResultSet<PostModel, any>
}
