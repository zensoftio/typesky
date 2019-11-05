import {Assembly, ClassLoaderAssembly} from 'type-injector'
import DefaultUserRecordStorage from '@App/model/user/storage'
import DefaultUserMapper from '@App/model/user/mapper'
import DefaultUserService from '@App/model/user/service'

export const USER_ASSEMBLY: Assembly =
  new ClassLoaderAssembly([
    DefaultUserMapper,
    DefaultUserService,
    DefaultUserRecordStorage
  ])
