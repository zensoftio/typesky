import {PostMapper} from 'Mappers';
import {PostRecordStorage} from '../../storages';
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection';
import BaseMapper from '../../common/mappers/base/base';

@mapper('Post')
export default class DefaultPostMapper extends BaseMapper implements PostMapper {

  constructor(@injectConstructor('PostRecordStorage') protected store: PostRecordStorage) {
    super()
  }

  get postList() {
    return this.store.get('postList')._ || [];
  }

  get post() {
    return this.store.get('post')._;
  }
}
