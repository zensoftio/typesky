import DefaultRecordStorage from '../../common/storages/base/default'
import {injectable} from 'type-injector'
import {SYSTEM_LAYERS} from '@App/layers'
import {Auth} from '@Entities/auth'
import {AuthRecordStorage} from '@App/model/auth/index'

@injectable(SYSTEM_LAYERS.auth.storageName)
export default class DefaultAuthRecordStorage extends DefaultRecordStorage<Auth.Records> implements AuthRecordStorage {

}
