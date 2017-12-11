import ResultSet from './base/result'
import Post from '../models/post'
import Todo from '../models/todo'
import ResultList from './base/list'
import {Maybe} from '../common/types'

export interface PostResults {
  postById: ResultSet<Post.Model, any>
}

export interface TodoResults {
  lastTodo: ResultSet<Maybe<Todo.Model>, any>
  all: ResultSet<ResultList<Todo.Model>, any>
}
