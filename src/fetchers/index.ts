export * from './impl/fetch'

export interface Fetcher {
  addHeader(name: string, value: string): void
  
  get(url: string, body?: any): Promise<Response>
  
  post(url: string, body?: any): Promise<Response>
  
  put(url: string, body?: any): Promise<Response>
  
  'delete'(url: string, body?: any): Promise<Response>
}