import BaseService from '../../common/services/base/base'
import {injectable} from 'type-injector'
import {ConfigService} from '@App/model/config/index'
import {SYSTEM_LAYERS} from '@App/layers'

@injectable(SYSTEM_LAYERS.config.serviceName)
export default class DefaultConfigService extends BaseService implements ConfigService {

  get processEnv() {
    return process.env
  }
}
