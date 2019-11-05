import {Assembly, ClassLoaderAssembly} from 'type-injector'
import DefaultAuthService from '@App/model/auth/service'
import DefaultAuthRecordStorage from '@App/model/auth/storage'
import DefaultAuthMapper from '@App/model/auth/mapper'

export const AUTH_ASSEMBLY: Assembly =
  new ClassLoaderAssembly([
    DefaultAuthService,
    DefaultAuthRecordStorage,
    DefaultAuthMapper
  ])
