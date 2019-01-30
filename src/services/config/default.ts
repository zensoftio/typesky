import {ConfigService} from '../index'
import BaseService from '../../common/services/base/base'
import {injectConstructor, injectMethod, service} from '../../common/annotations/dependency-injection'

@service('Config')
export default class DefaultConfigService extends BaseService implements ConfigService {

  get processEnv() {
    return process.env
  }
}
