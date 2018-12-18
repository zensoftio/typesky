import {Account} from '../../models/account'
import {AccountRecordStorage} from '../index'
import {storage} from '../../common/annotations/dependency-injection'
import DefaultRecordStorage from '../../common/storages/base/default'

@storage('Account')
export default class DefaultAccountRecordStorage extends DefaultRecordStorage<Account.Records> implements AccountRecordStorage {

}
