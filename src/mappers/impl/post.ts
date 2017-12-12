import {PostMapper} from '../index'
import {injectable, injectOnProperty} from '../../common/annotations/common'
import {computed} from 'mobx'
import {PostRecordStorage} from '../../storages'

@injectable('PostMapper')
export default class DefaultPostMapper implements PostMapper {
  
  constructor(@injectOnProperty('PostRecordStorage') protected store: PostRecordStorage) {
  
  }
  
  @computed
  get postById() {
    return this.store.get('postById')._
  }
}
