import {PostResults, TodoResults} from '../results'
import {ResultStore} from './base'
import TodoModel from '../models/todo'

export interface TodoStore extends ResultStore<TodoResults> {
  toggleTodo(todo: TodoModel): void
}

export interface PostStore extends ResultStore<PostResults> {

}
