import {AccountMapper} from '../index'
import {AccountRecordStorage} from '../../storages'
import {computed} from 'mobx'
import {Account} from '../../models/account'
import {Maybe} from '../../common/types'
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection'

@mapper('Account')
export class DefaultAccountMapper implements AccountMapper {

  constructor(@injectConstructor('AccountRecordStorage') protected store: AccountRecordStorage) {
  }

  @computed
  get currentUser(): Maybe<Account.CurrentUser> {
    return this.store.get('currentUser')._
  }
}
