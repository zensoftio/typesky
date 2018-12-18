import DefaultRecordStorage from '../../../common/storages/base/default'
import {storage} from '../../common/annotations/common'
import {Account} from '../../models/account'
import {AccountRecordStorage} from '../index'

@storage('Account')
export default class DefaultAccountRecordStorage extends DefaultRecordStorage<Account.Records> implements AccountRecordStorage {

}
