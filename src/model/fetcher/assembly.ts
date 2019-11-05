import {Assembly, ClassLoaderAssembly} from 'type-injector'
import DefaultFetcher from '@App/model/fetcher/service'

export const FETCHER_ASSEMBLY: Assembly =
  new ClassLoaderAssembly([
    DefaultFetcher,
  ])
