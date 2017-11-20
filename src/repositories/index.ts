import TodoModel from '../models/todo'
import SimpleBaseModel from '../models/base/simple'

export * from './impl/todo'

export interface BaseRepository<T extends SimpleBaseModel> {
  list: T[]
  
  add(model: T): this
  
  remove(model: T): this
  
  removeAll(): this
  
  update(model: T, changes: Partial<T>): this
}

export interface TodoRepository extends BaseRepository<TodoModel> {

}