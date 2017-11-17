import {TodoRepository} from '../index'
import TodoModel from '../../models/todo'
import DefaultBaseRepository from './base/repository'

export class DefaultTodoRepository extends DefaultBaseRepository<TodoModel> implements TodoRepository {

}

export const defaultTodoRepository = new DefaultTodoRepository()
