import {injectable} from 'type-injector'
import {JSON} from 'ta-json'
import {SYSTEM_LAYERS} from '@App/layers'
import {Fetcher} from '@App/model/fetcher/index'

interface HeadersContainer {
  [key: string]: string
}

@injectable(SYSTEM_LAYERS.fetcher.serviceName)
export default class DefaultFetcher implements Fetcher {

  private headersRaw: HeadersContainer = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }

  private get headers() {
    return new Headers(this.headersRaw)
  }

  addHeader(name: string, value: string) {
    this.headersRaw[name] = value
  }

  get<T>(url: string, body: any = {}, schema?: Function): Promise<T> {

    const params = Object.keys(body)
      .map(prop => [prop, body[prop]].join('='))
      .join('&')

    return this.fetch(`${url}?${params}`, this.defaultRequestInit('get'), schema)
  }

  post<T>(url: string, body: any = {}, schema?: Function): Promise<T> {
    return this.fetch(`${url}`, {
      ...this.defaultRequestInit('post'),
      body: JSON.stringify(body)
    }, schema)
  }

  put<T>(url: string, body: any = {}, schema?: Function): Promise<T> {
    return this.fetch(`${url}`, {
      ...this.defaultRequestInit('put'),
      body: JSON.stringify(body)
    }, schema)
  }

  'delete'<T>(url: string, body: any = {}, schema?: Function): Promise<T> {
    return this.fetch(`${url}`, {
      ...this.defaultRequestInit('delete'),
      body: JSON.stringify(body)
    }, schema)
  }

  postConstructor() {
  }

  awakeAfterInjection() {
  }

  private defaultRequestInit(method: string): RequestInit {
    return {
      method,
      headers: this.headers,
      // credentials: 'include'
    }
  }

  private fetch<T>(input: RequestInfo, init?: RequestInit, schema?: Function): Promise<T> {
    return fetch(input, init)
      .then(this.handleResponse(input, init, schema))
      .then(json => schema ? this.instantiateJson(json, schema) : json)
  }

  private handleResponse = (input: RequestInfo, init?: RequestInit, schema?: Function) =>
    async (res: Response) => {
      if (res.status === 200 || res.status === 201 || res.status === 202 || res.status === 203) {
        return this.parseJSON(res)
      } else {
        const response: string = await res.text()
        if (!!response) {
          const errorMessageObject: { error: string, message: string, statusCode: string } = JSON.parse(response)
          throw new Error(errorMessageObject.message)
        } else {
          throw new Error(res.statusText)
        }
      }
    }

  private parseJSON = (response: any) => {
    return response.text().then((text: any) => {
      try {
        return text ? JSON.parse(text) : response
      } catch (e) {
        return text
      }
    })
  }

  private instantiateJson = <T>(json: any, schema: Function) => {
    return JSON.deserialize(json, schema)
  }
}
