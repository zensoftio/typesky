import {AccountMapper} from '../index'
import {AccountRecordStorage} from '../../storages'
import {injectConst, mapper} from '../../common/annotations/common'
import {computed} from 'mobx'
import {Account} from '../../models/account'
import {Maybe} from '../../common/types'

@mapper('Account')
export class DefaultAccountMapper implements AccountMapper {

  constructor(@injectConst('AccountRecordStorage') protected store: AccountRecordStorage) {
  }

  @computed
  get currentUser(): Maybe<Account.CurrentUser> {
    return this.store.get('currentUser')._
  }
}
