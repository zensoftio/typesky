import Todo from '../models/todo'
import {RecordStorage} from './base'
import Post from '../models/post'

export interface TodoRecordStorage extends RecordStorage<Todo.Records> {
  newModel(): Todo.Model
  
  toggleTodo(todo: Todo.Model): this
  
  addNewToAllList(todo: Todo.Model): this
}

export interface PostRecordStorage extends RecordStorage<Post.Records> {
  loadPost(postJson: any): this
}
