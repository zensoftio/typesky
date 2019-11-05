import BaseService from '@App/common/services/base/base'
import ProcessEnv = NodeJS.ProcessEnv

export interface ConfigService extends BaseService {

  processEnv: ProcessEnv
}
