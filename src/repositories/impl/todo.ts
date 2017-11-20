import {TodoRepository} from '../index'
import {injectable} from '../../common/annotations/common'
import QueryBaseRepository from '../base/impl/query'
import {TodoMapping} from '../../mappings/index'

@injectable('TodoRepository')
export class DefaultTodoRepository extends QueryBaseRepository<TodoMapping> implements TodoRepository {

}
