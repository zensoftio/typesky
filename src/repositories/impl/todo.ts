import {TodoRepository} from '../index'
import {injectable} from '../../common/annotations/common'
import QueryBaseRepository from './base/query'

@injectable('TodoRepository')
export class DefaultTodoRepository extends QueryBaseRepository implements TodoRepository {

}
