import {WithRequestMetadata} from '@Types'
import BaseMapper from '../../common/mappers/base/base'
import {injectable, injectConstructor} from 'type-injector'
import {SYSTEM_LAYERS} from '@App/layers'
import {AuthMapper, AuthRecordStorage} from '@App/model/auth/index'

@injectable(SYSTEM_LAYERS.auth.mapperName)
export default class DefaultAuthMapper extends BaseMapper implements AuthMapper {
  constructor(@injectConstructor(SYSTEM_LAYERS.auth.storageName) protected store: AuthRecordStorage) {
    super()
  }

  get resetPasswordTokenValid() {
    return this.store.getWithDefault('resetPasswordTokenValid', WithRequestMetadata.empty())._
  }

  get isSignUpTokenActive(): WithRequestMetadata<{message?: string, isValid: boolean}> {
    return this.store.getWithDefault('isActivatedAfterSignUp', WithRequestMetadata.empty())._
  }

  get isLoggedIn(): boolean {
    return this.store.get('isLoggedIn')._
  }
}
