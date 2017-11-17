import TodoModel from '../models/todo'

export interface TodoService {
  createNew(): void
  
  toggleTodo(todo: TodoModel): void
}