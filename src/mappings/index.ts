import ResultSet from '../common/result'
import PostModel from '../models/post'
import TodoModel from '../models/todo'
import {ResultBaseMapping} from './base/index'

export interface PostMapping extends ResultBaseMapping {
  postById: ResultSet<PostModel>
}

export interface TodoMapping extends ResultBaseMapping {
  lastTodo: ResultSet<TodoModel | undefined>
  all: ResultSet<TodoModel[]>
}