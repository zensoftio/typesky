import {TodoRepository} from '../index'
import TodoModel from '../../models/todo'
import {injectable} from '../../annotations/common'
import UniqBaseRepository from './base/uniq'

@injectable('TodoRepository')
export class DefaultTodoRepository extends UniqBaseRepository<TodoModel> implements TodoRepository {

}
