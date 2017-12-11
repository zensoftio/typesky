import Todo from '../models/todo'
import Post from '../models/post'
import ResultSet from '../results/base/result'
import {Maybe} from '../common/types'

export interface TodoMapper {
  
  all: Todo.Model[]
  
  unfinishedTodoCount: number
  
  lastOne: Maybe<Todo.Model>
}

export interface PostMapper {
  
  postById: ResultSet<Post.Model, any>
}
