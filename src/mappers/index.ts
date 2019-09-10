import Post from '../models/post';
import {Maybe} from '../common/types';
import {Account} from '../models/account';
import BaseMapper from '../common/mappers/base/base';

export interface PostMapper extends BaseMapper {
  post: Maybe<Post.PostItem>;
  postList: Array<Post.PostItem>;
}

export interface AccountMapper extends BaseMapper {
  currentUser: Maybe<Account.CurrentUser>;
}
