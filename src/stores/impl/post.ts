import {PostStore} from '../index'
import {PostRepository} from '../../repositories/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import {computed} from 'mobx'
import ResultSet from '../../common/result'
import PostModel from '../../models/post'

@injectable('PostStore')
export default class DefaultPostStore implements PostStore {
  
  constructor(@injectOnProperty('PostRepository') protected repository: PostRepository) {
  
  }
  
  @computed
  get postById() {
    return this.repository.get('postById') as ResultSet<PostModel | undefined>
  }
}
