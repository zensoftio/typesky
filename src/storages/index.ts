import {RecordStorage} from '../common/storages/base';
import Post from '../models/post';
import {Account} from '../models/account';

export interface PostRecordStorage extends RecordStorage<Post.Records> {
}

export interface AccountRecordStorage extends RecordStorage<Account.Records> {
}
