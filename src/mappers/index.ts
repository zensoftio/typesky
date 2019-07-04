import Todo from '../models/todo';
import Post from '../models/post';
import {Maybe} from '../common/types';
import {Account} from '../models/account';
import BaseMapper from '../common/mappers/base/base';

export interface TodoMapper extends BaseMapper {
  all: Todo.Model[];
  unfinishedTodoCount: number;
  lastOne: Maybe<Todo.Model>;
}

export interface PostMapper extends BaseMapper {
  postById: Post.Model | undefined;
}

export interface AccountMapper extends BaseMapper {
  currentUser: Maybe<Account.CurrentUser>;
}
