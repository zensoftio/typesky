import ResultSet from '../common/result'
import PostModel from '../models/post'
import TodoModel from '../models/todo'

export interface PostMapping {
  postById: ResultSet<PostModel>
}

export interface TodoMapping {
  lastTodo: ResultSet<TodoModel | undefined>
  all: ResultSet<TodoModel[]>
}