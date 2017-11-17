import TodoModel from '../models/todo'

export interface BaseRepository<T> {
  list: T[]
  
  add(model: T): this
  
  remove(model: T): this
  
  removeAll(): this
  
  update(model: T, changes: Partial<T>): this
}

export interface TodoRepository extends BaseRepository<TodoModel> {

}