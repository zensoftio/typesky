import TodoModel from '../models/todo'

export * from './impl/todo'
export * from './impl/post'

export interface TodoService {
  createNew(): void
  
  toggleTodo(todo: TodoModel): void
}

export interface PostService {
  loadPost(postId: number): void
}