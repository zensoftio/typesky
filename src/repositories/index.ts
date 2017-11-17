import TodoModel from '../models/todo'
import BaseModel from '../models/base/model'

export * from './impl/todo'

export interface BaseRepository<T extends BaseModel> {
  list: T[]
  
  add(model: T): this
  
  remove(model: T): this
  
  removeAll(): this
  
  update(model: T, changes: Partial<T>): this
}

export interface TodoRepository extends BaseRepository<TodoModel> {

}