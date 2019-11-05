import {AUTH_ASSEMBLY} from '@App/model/auth/assembly'
import {CONFIG_ASSEMBLY} from '@App/model/config/assembly'
import {FETCHER_ASSEMBLY} from '@App/model/fetcher/assembly'
import {USER_ASSEMBLY} from '@App/model/user/assembly'

const ASSEMBLIES = [
  FETCHER_ASSEMBLY,
  AUTH_ASSEMBLY,
  CONFIG_ASSEMBLY,
  USER_ASSEMBLY
]

export default ASSEMBLIES
