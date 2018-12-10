import {PostMapper} from '../index'
import {computed} from 'mobx'
import {PostRecordStorage} from '../../storages'
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection'
import BaseMapper from '../../common/mappers/base/base'

@mapper('Post')
export default class DefaultPostMapper extends BaseMapper implements PostMapper {

  constructor(@injectConstructor('PostRecordStorage') protected store: PostRecordStorage) {
    super()
  }

  @computed
  get postById() {
    return this.store.get('postById')._
  }
}
