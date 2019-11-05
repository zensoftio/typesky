export interface Fetcher {
  addHeader(name: string, value: string | undefined): void

  get<T>(url: string, body?: any, schema?: Function): Promise<T>

  post<T>(url: string, body?: any, schema?: Function, errorHandler?: Function): Promise<T>

  put<T>(url: string, body?: any, schema?: Function, errorHandler?: Function): Promise<T>

  'delete'<T>(url: string, body?: any, schema?: Function): Promise<T>
}
