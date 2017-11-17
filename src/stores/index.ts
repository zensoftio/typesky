import TodoModel from '../models/todo'

export * from './impl/todo'

export interface TodoStore {
  all: TodoModel[]
  
  unfinishedTodoCount: number
  
  lastOne: TodoModel
}
