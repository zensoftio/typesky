type NoValue = null | undefined

export type Maybe<T> = T | NoValue

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export const isDefined = <T>(x: Maybe<T>): x is T => x !== undefined && x !== null

export const isUndefined = <T>(x: Maybe<T>): x is NoValue => x === undefined || x === null

export const getOrElse = <T>(x: Maybe<T>, defaultValue: T): T => isDefined(x) ? x : defaultValue

export interface PageData<T> {
  offset: number
  limit: number
  data: T
}

export type RequestStatus = 'empty' | 'requested' | 'ready' | 'error'

export class WithRequestMetadata<T> {
  constructor(
    readonly requestStatus: RequestStatus,
    readonly data?: T,
    readonly error?: Error
  ) { }

  static error<T>(err: Error): WithRequestMetadata<T> {
    return new WithRequestMetadata<T>('error', undefined, err)
  }

  static data<T>(data: T): WithRequestMetadata<T> {
    return new WithRequestMetadata<T>('ready', data)
  }

  static requested<T>(): WithRequestMetadata<T> {
    return new WithRequestMetadata<T>('requested')
  }

  static empty<T>(): WithRequestMetadata<T> {
    return new WithRequestMetadata<T>('empty')
  }
}
