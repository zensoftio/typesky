import {AuthService} from '../index'
import {Fetcher} from '../../fetchers/index'
import {injectable, injectOnMethod} from '../../common/annotations/common'
import * as jwt from 'jwt-client'
import {Maybe} from '../../common/types'
import {configuration} from '../../configs/index'

interface TokenContainer {
  token: Maybe<string>,
  refreshToken: Maybe<string>
}

enum JWT_STORAGE_NAMES {
  token = 'JWT_TOKEN',
  refreshToken = 'JWT_REFRESH_TOKEN'
}

@injectable('AuthService')
export default class DefaultAuthService implements AuthService {
  
  private fetcher: Fetcher
  private tokenContainer: TokenContainer
  
  constructor() {
    this.tokenContainer = DefaultAuthService.loadTokenContainer()
  }
  
  @injectOnMethod('Fetcher')
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }
  
  postConstructor() {
    return this.checkToken()
  }
  
  async checkToken() {
    if (this.validateToken(this.tokenContainer.token)) {
      return this.setHeaders(this.tokenContainer.token)
    }
    if (this.validateToken(this.tokenContainer.refreshToken)) {
      return this.refresh()
    } else {
      return this.noToken()
    }
  }
  
  async login(username: string, password: string) {
    const responseRaw = await this.fetcher.post(configuration.tokenApi, {
      username,
      password
    })
    
    const tokenContainer: TokenContainer = await responseRaw.json()
    
    if (this.validateToken(tokenContainer.token)) {
      this.persistTokenContainer(tokenContainer)
    }
  }
  
  isLogged() {
    return !!this.validateToken(this.tokenContainer.token)
  }
  
  getAuthInfo() {
    return jwt.read(this.tokenContainer.token as string).claim
  }
  
  /**
   * implement if there is no token, maybe you want redirect to login page
   * @returns {Promise<any>}
   */
  private noToken() {
    return this.login('user@zensoft.io', 'password')
  }
  
  private async refresh(refreshToken: Maybe<string> = this.tokenContainer.refreshToken) {
    const responseRaw = await this.fetcher.post(configuration.refreshTokenApi, {
      refreshToken
    })
    
    const tokenContainer: TokenContainer = await responseRaw.json()
    
    if (this.validateToken(tokenContainer.token)) {
      this.persistTokenContainer(tokenContainer)
    }
  }
  
  private validateToken(token: Maybe<string>) {
    return token && jwt.validate(token)
  }
  
  private setHeaders(token: Maybe<string>) {
    if (this.validateToken(token)) {
      this.fetcher.addHeader('X-Authorization', `Bearer ${token}`)
    }
  }
  
  private persistTokenContainer(tokenContainer: TokenContainer) {
    this.tokenContainer = tokenContainer
    this.setHeaders(tokenContainer.token)
    jwt.set(tokenContainer.token, JWT_STORAGE_NAMES.token)
    jwt.set(tokenContainer.refreshToken, JWT_STORAGE_NAMES.refreshToken)
  }
  
  static loadTokenContainer() {
    return {
      token: jwt.get(JWT_STORAGE_NAMES.token),
      refreshToken: jwt.get(JWT_STORAGE_NAMES.refreshToken)
    }
  }
  
}