import {injectable, injectOnMethod} from '../../common/annotations/common'
import {Fetcher} from '../index'
import InjectableLifecycle from '../../common/injectable-lifecycle'
import {AuthService} from '../../services'

interface HeadersContainer {
  [key: string]: string
}

@injectable('Fetcher')
export default class DefaultFetcher implements Fetcher, InjectableLifecycle {
  
  private authService: AuthService
  
  private headersRaw: HeadersContainer = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  
  private get headers() {
    return new Headers(this.headersRaw)
  }
  
  @injectOnMethod('AuthService')
  setFetcher(authService: AuthService) {
    this.authService = authService
  }
  
  addHeader(name: string, value: string) {
    this.headersRaw[name] = value
  }
  
  get(url: string, body: any = {}) {
    
    const params = Object.keys(body)
                         .map(prop => [prop, body[prop]].join('='))
                         .join('&')
    
    return this.fetch(`${url}?${params}`, this.defaultRequestInit('get'))
  }
  
  post(url: string, body: any = {}) {
    return this.fetch(`${url}`, {
      ...this.defaultRequestInit('post'),
      body: JSON.stringify(body)
    })
  }
  
  put(url: string, body: any = {}) {
    return this.fetch(`${url}`, {
      ...this.defaultRequestInit('put'),
      body: JSON.stringify(body)
    })
  }
  
  'delete'(url: string, body: any = {}) {
    return this.fetch(`${url}`, {
      ...this.defaultRequestInit('delete'),
      body: JSON.stringify(body)
    })
  }
  
  postConstructor() {
    return Promise.resolve()
  }
  
  onReady() {
    return Promise.resolve()
  }
  
  private defaultRequestInit(method: string): RequestInit {
    return {
      method,
      headers: this.headers,
      credentials: 'include'
    }
  }
  
  private fetch(input: RequestInfo, init?: RequestInit, counter: number = 0): Promise<Response> {
    return fetch(input, init)
      .then(this.handleResponse(input, init, counter))
  }
  
  private handleResponse = (input: RequestInfo, init?: RequestInit, counter: number = 0) => async (res: Response) => {
    if (res.status === 200) {
      return res.json()
    }
    if (res.status === 401 && counter < 1) {
      await this.authService.checkToken()
      return this.fetch(input, {...init, headers: this.headers}, counter + 1)
      // window.location.reload()
    }
    throw res
  }
}