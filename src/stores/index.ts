import TodoModel from '../models/todo'
import PostModel from '../models/post'
import ResultSet from '../common/result'

export * from './impl/todo'
export * from './impl/post'

export interface TodoStore {
  
  all: TodoModel[]
  
  unfinishedTodoCount: number
  
  lastOne: TodoModel | undefined
}

export interface PostStore {
  
  postById: ResultSet<PostModel | undefined>
}
