import TodoModel from '../models/todo'

export * from './impl/todo'

export interface TodoService {
  createNew(): void
  
  toggleTodo(todo: TodoModel): void
}