import TodoModel from '../models/todo'
import PostModel from '../models/post'
import ResultSet from '../results/base/result'

// here we need to list all implementations
export * from './impl/todo'
export * from './impl/post'

export interface TodoMapper {
  
  all: TodoModel[]
  
  unfinishedTodoCount: number
  
  lastOne: TodoModel | undefined
}

export interface PostMapper {
  
  postById: ResultSet<PostModel | undefined>
}
