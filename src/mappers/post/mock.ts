import {PostMapper} from '../index'
import {injectConst, mapper} from '../../common/annotations/common'
import {computed} from 'mobx'
import {PostRecordStorage} from '../../storages'

@mapper
export default class DefaultPostMapper implements PostMapper {
  
  constructor(@injectConst('PostRecordStorage') protected store: PostRecordStorage) {
  
  }
  
  @computed
  get postById() {
    return this.store.get('postById')._
  }
}
