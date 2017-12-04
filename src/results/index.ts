import ResultSet from './base/result'
import PostModel from '../models/post'
import TodoModel from '../models/todo'
import ResultList from './base/list'
import {Maybe} from '../common/types'

export interface PostResults {
  postById: ResultSet<PostModel, any>
}

export interface TodoResults {
  lastTodo: ResultSet<Maybe<TodoModel>, any>
  all: ResultSet<ResultList<TodoModel>, any>
}