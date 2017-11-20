import {PostRepository} from '../index'
import {injectable} from '../../common/annotations/common'
import QueryBaseRepository from '../base/impl/query'
import {PostMapping} from '../../mappings/index'

@injectable('PostRepository')
export class DefaultPostRepository extends QueryBaseRepository<PostMapping> implements PostRepository {

}
