import {AccountMapper} from '../index'
import {AccountRecordStorage} from '../../storages'
import {computed} from 'mobx'
import {Account} from '../../models/account'
import {Maybe} from '../../common/types'
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection'
import BaseMapper from '../../common/mappers/base/base'

@mapper('Account')
export class DefaultAccountMapper extends BaseMapper implements AccountMapper {

  constructor(@injectConstructor('AccountRecordStorage') protected store: AccountRecordStorage) {
    super()
  }

  @computed
  get currentUser(): Maybe<Account.CurrentUser> {
    return this.store.get('currentUser')._
  }
}
