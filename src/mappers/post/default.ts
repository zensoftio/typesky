import {PostMapper} from '../index'
import {computed} from 'mobx'
import {PostRecordStorage} from '../../storages'
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection'

@mapper('Post')
export default class DefaultPostMapper implements PostMapper {

  constructor(@injectConstructor('PostRecordStorage') protected store: PostRecordStorage) {

  }

  @computed
  get postById() {
    return this.store.get('postById')._
  }
}
