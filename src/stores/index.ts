import TodoModel from '../models/todo'

export interface Store<T> {
  all: T[]
  
  getPaged(offset?: number, limit?: number, sortBy?: string, sortDirection?: 'ASC' | 'DESC'): T[]
}

export interface TodoStore {
  all: TodoModel[]
  
  unfinishedTodoCount: number
  
  lastOne(): TodoModel
}
