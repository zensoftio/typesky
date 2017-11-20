import {PostRepository} from '../index'
import {injectable} from '../../common/annotations/common'
import QueryBaseRepository from './base/query'

@injectable('PostRepository')
export class DefaultPostRepository extends QueryBaseRepository implements PostRepository {

}
