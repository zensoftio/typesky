import Todo from '../models/todo'
import Post from '../models/post'
import {Maybe} from '../common/types'
import {Account} from '../models/account'

export interface TodoMapper {

  all: Todo.Model[]

  unfinishedTodoCount: number

  lastOne: Maybe<Todo.Model>
}

export interface PostMapper {

  postById: Post.Model | undefined
}

export interface AccountMapper {
  currentUser: Maybe<Account.CurrentUser>;
}
