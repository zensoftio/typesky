export default interface ResultSetWriter<T, K> {
  
  loadResult(result: T): this
  
  clearResult(): this
  
  clearError(): this
  
  setError(error: K): this
}