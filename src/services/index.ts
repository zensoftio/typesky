import TodoModel from '../models/todo'
import BaseService from './base/base'

export interface TodoService extends BaseService {
  createNew(): void
  
  toggleTodo(todo: TodoModel): void
}

export interface PostService extends BaseService {
  loadPost(postId: number): void
}

export interface AuthService extends BaseService {
  login(username: string, password: string): void
  
  checkToken(): Promise<void>
  
  isLogged(): boolean
  
  getAuthInfo(): any
}
