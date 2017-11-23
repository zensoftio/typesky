type NoValue = null | undefined

export type Maybe<T> = T | NoValue

export const isDefined = <T>(x: Maybe<T>): x is T => x !== undefined && x !== null

export const isUndefined = <T>(x: Maybe<T>): x is NoValue => x === undefined || x === null

export const getOrElse = <T>(x: Maybe<T>, defaultValue: T): T => isDefined(x) ? x : defaultValue
