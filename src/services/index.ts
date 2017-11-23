import TodoModel from '../models/todo'

// here we need to list all implementations
export * from './impl/todo'
export * from './impl/post'
export * from './impl/auth'

export interface TodoService {
  createNew(): void
  
  toggleTodo(todo: TodoModel): void
}

export interface PostService {
  loadPost(postId: number): void
}

export interface AuthService {
  login(username: string, password: string): void
  
  checkToken(): Promise<void>
  
  isLogged(): boolean
  
  getAuthInfo(): any
}
