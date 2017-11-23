import ResultSet from './base/result'
import PostModel from '../models/post'
import TodoModel from '../models/todo'

export interface PostResults {
  postById: ResultSet<PostModel, any>
}

export interface TodoResults {
  lastTodo: ResultSet<TodoModel | undefined, any>
  all: ResultSet<TodoModel[], any>
}