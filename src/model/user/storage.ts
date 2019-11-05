import DefaultRecordStorage from '../../common/storages/base/default'
import {injectable} from 'type-injector'
import {SYSTEM_LAYERS} from '@App/layers'
import User from '@Entities/user/user'
import {UserRecordStorage} from '@App/model/user/index'

@injectable(SYSTEM_LAYERS.user.storageName)
export default class DefaultUserRecordStorage extends DefaultRecordStorage<User.Records> implements UserRecordStorage {

}
