import ResultSet from './base/result'
import PostModel from '../models/post'
import TodoModel from '../models/todo'

export interface PostResults {
  postById: ResultSet<PostModel>
}

export interface TodoResults {
  lastTodo: ResultSet<TodoModel | undefined>
  all: ResultSet<TodoModel[]>
}