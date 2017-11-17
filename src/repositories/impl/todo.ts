import {TodoRepository} from '../index'
import TodoModel from '../../models/todo'
import DefaultBaseRepository from './base/repository'
import {injectable} from '../../annotations/common'

@injectable('TodoRepository')
export class DefaultTodoRepository extends DefaultBaseRepository<TodoModel> implements TodoRepository {

}
