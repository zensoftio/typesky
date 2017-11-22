import {injectable} from '../../common/annotations/common'
import {Fetcher} from '../index'

interface HeadersContainer {
  [key: string]: string
}

@injectable('Fetcher')
export default class DefaultFetcher implements Fetcher {
  
  private headersRaw: HeadersContainer = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  private get headers() {
    return new Headers(this.headersRaw)
  }
  
  addHeader(name: string, value: string) {
    this.headersRaw[name] = value
  }
  
  get(url: string, body: any = {}) {
    
    const params = Object.keys(body)
                         .map(prop => [prop, body[prop]].join('='))
                         .join('&')
    
    return fetch(`${url}?${params}`, {
      method: 'get',
      headers: this.headers
    })
  }
  
  post(url: string, body: any = {}) {
    return fetch(`${url}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: this.headers
    })
  }
  
  put(url: string, body: any = {}) {
    return fetch(`${url}`, {
      method: 'put',
      body: JSON.stringify(body),
      headers: this.headers
    })
  }
  
  'delete'(url: string, body: any = {}) {
    return fetch(`${url}`, {
      method: 'delete',
      body: JSON.stringify(body),
      headers: this.headers
    })
  }
}