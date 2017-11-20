import QueryBaseRepository from './impl/base/query'

export * from './impl/todo'
export * from './impl/post'

export interface TodoRepository extends QueryBaseRepository {

}

export interface PostRepository extends QueryBaseRepository {

}