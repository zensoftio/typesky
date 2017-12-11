export interface Fetcher {
  addHeader(name: string, value: string): void
  
  get(url: string, body?: any, schema?: Function): Promise<any>
  
  post(url: string, body?: any, schema?: Function): Promise<any>
  
  put(url: string, body?: any, schema?: Function): Promise<any>
  
  'delete'(url: string, body?: any, schema?: Function): Promise<any>
}
