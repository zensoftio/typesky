import Todo from '../models/todo'
import Post from '../models/post'
import {Maybe} from '../common/types'
import {Account} from '../models/account'
import {Injectable} from '../common/dependency-container'

export interface TodoMapper extends Injectable {

  all: Todo.Model[]

  unfinishedTodoCount: number

  lastOne: Maybe<Todo.Model>
}

export interface PostMapper extends Injectable {

  postById: Post.Model | undefined
}

export interface AccountMapper {
  currentUser: Maybe<Account.CurrentUser>;
}
