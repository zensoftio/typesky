import Todo from '../models/todo'
import Post from '../models/post'
import {Maybe} from '../common/types'

export interface TodoMapper {
  
  all: Todo.Model[]
  
  unfinishedTodoCount: number
  
  lastOne: Maybe<Todo.Model>
}

export interface PostMapper {
  
  postById: Post.Model | undefined
}
