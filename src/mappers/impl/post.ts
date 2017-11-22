import {PostMapper} from '../index'
import {PostStore} from '../../stores/index'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import {computed} from 'mobx'

@injectable('PostMapper')
export default class DefaultPostMapper implements PostMapper {
  
  constructor(@injectOnProperty('PostStore') protected repository: PostStore) {
  
  }
  
  @computed
  get postById() {
    return this.repository.get('postById')
  }
}
