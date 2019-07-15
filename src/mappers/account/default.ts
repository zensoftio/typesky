import {AccountMapper} from 'Mappers';
import {AccountRecordStorage} from '../../storages';
import {Account} from '../../models/account';
import {Maybe} from '../../common/types';
import {injectConstructor, mapper} from '../../common/annotations/dependency-injection';
import BaseMapper from '../../common/mappers/base/base';

@mapper('Account')
export class DefaultAccountMapper extends BaseMapper implements AccountMapper {
  constructor(@injectConstructor('AccountRecordStorage') protected store: AccountRecordStorage) {
    super()
  }

  get currentUser(): Maybe<Account.CurrentUser> {
    return this.store.get('currentUser')._
  }
}
