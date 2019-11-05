import {Assembly, ClassLoaderAssembly} from 'type-injector'
import DefaultConfigService from '@App/model/config/service'

export const CONFIG_ASSEMBLY: Assembly =
  new ClassLoaderAssembly([
    DefaultConfigService,
  ])
