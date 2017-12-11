import {PostResults, TodoResults} from '../results'
import {ResultStore} from './base'
import Todo from '../models/todo'

export interface TodoStore extends ResultStore<TodoResults> {
  toggleTodo(todo: Todo.Model): void
}

export interface PostStore extends ResultStore<PostResults> {

}
