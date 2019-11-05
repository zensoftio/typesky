import BaseMapper from '../../common/mappers/base/base'
import {injectable, injectProperty} from 'type-injector'
import {SYSTEM_LAYERS} from '@App/layers'
import {UserMapper, UserRecordStorage} from '@App/model/user/index'
import {computed} from 'mobx'
import {WithRequestMetadata} from '@Types'

@injectable(SYSTEM_LAYERS.user.mapperName)
export default class DefaultUserMapper extends BaseMapper implements UserMapper {

  @injectProperty(SYSTEM_LAYERS.user.storageName)
  private store: UserRecordStorage

  @computed
  get getUserInfo() {
    return this.store.getWithDefault('userInfo', WithRequestMetadata.empty())._
  }
}
