import {PostStore} from '../index'
import {injectable} from '../../common/annotations/common'
import BaseResultStore from '../base/impl/result'
import {PostResults} from '../../results/index'

@injectable('PostStore')
export class DefaultPostStore extends BaseResultStore<PostResults> implements PostStore {

}
