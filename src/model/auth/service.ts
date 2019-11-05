import BaseService from '../../common/services/base/base'
import {injectable, injectConstructor, injectMethod} from 'type-injector'
import {SYSTEM_LAYERS} from '@App/layers'
import {AuthRecordStorage, AuthService} from '@App/model/auth/index'
import {Fetcher} from '@App/model/fetcher'
import Pathes from '@App/dicts/pathes'
import * as JWT from 'jwt-decode'
import {Maybe, WithRequestMetadata} from '@Types'
import {CurrentUser} from '@Entities/auth'
import {UserDTO} from '@Entities/user/userDTO'

export interface TokenContainer {
  access_token: Maybe<string>,
  refresh_token: Maybe<string>
}

export interface DecodeTokenContainer {
  sub: string
  iat: number
  exp: number
}

enum JWT_STORAGE_NAMES {
  access_token = 'JWT_TOKEN',
  refresh_token = 'JWT_REFRESH_TOKEN'
}

@injectable(SYSTEM_LAYERS.auth.serviceName)
export default class DefaultAuthService extends BaseService implements AuthService {

  private fetcher: Fetcher
  private tokenContainer: TokenContainer

  constructor(
    @injectConstructor(SYSTEM_LAYERS.auth.storageName) private authStore: AuthRecordStorage
  ) {
    super()
    this.tokenContainer = DefaultAuthService.loadTokenContainer()
  }

  @injectMethod(SYSTEM_LAYERS.fetcher.serviceName)
  setFetcher(fetch: Fetcher) {
    this.fetcher = fetch
  }

  logOut() {
    localStorage.clear()
    this.setIsLogged(false)
    this.fetcher.addHeader('Authorization', undefined)
  }

  async login(email: string, password: string) {
    const params = {email, password}
    try {
      const tokenContainer: TokenContainer = await this.fetcher.post<TokenContainer>(Pathes.Auth.signIn, params)
      if (this.checkForExpired(tokenContainer.access_token)) {
        this.persistTokenContainer(tokenContainer)
      }
    } catch (error) {
      throw error
    }
  }

  async signUp(data: UserDTO.SignUpDTO): Promise<void> {
    try {
      await this.fetcher.post(Pathes.Auth.signUp, data)
    } catch (e) {
      throw e
    }
  }

  async activateToken(token: string) {
    try {
      await this.fetcher.post(Pathes.Auth.activate, {token})
      this.authStore.set('isActivatedAfterSignUp', WithRequestMetadata.data({isValid: true}))
    } catch (error) {
      if (error.message === 'jwt expired') {
        this.authStore.set('isActivatedAfterSignUp', WithRequestMetadata.data({message: error.message, isValid: true}))
      } else {
        this.authStore.set('isActivatedAfterSignUp', WithRequestMetadata.data({isValid: false}))
      }
    }
  }

  async checkEmail(email: string): Promise<void> {
    const params = {email}
    try {
      await this.fetcher.post(Pathes.Auth.emailValidation, params)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  checkUserAuthorised(): void {
    this.tokenContainer.access_token = localStorage.getItem(JWT_STORAGE_NAMES.access_token)
    this.tokenContainer.refresh_token = localStorage.getItem(JWT_STORAGE_NAMES.refresh_token)
    if (this.tokenContainer.access_token && this.tokenContainer.refresh_token) {
      if (this.checkForExpired(this.tokenContainer.access_token)) {
        this.setIsLogged(!!this.tokenContainer.access_token)
        this.fetcher.addHeader('Authorization', `Bearer ${this.tokenContainer.access_token}`)
      } else {
        this.refresh(this.tokenContainer.refresh_token)
      }
    } else {
      this.authStore.set('isLoggedIn', false)
    }
  }

  checkForExpired = (token: Maybe<string>): boolean => {
    const currentDateInTimestamp = this.getCurrentDateInTimestamp()
    const decodeToken: DecodeTokenContainer = JWT(token || '')
    return decodeToken.exp > currentDateInTimestamp
  }

  getCurrentDateInTimestamp = (): number => {
    const currentDate = new Date().getTime() / 1000
    return Number(currentDate.toString().split('.')[0])
  }

  getAuthInfo(): CurrentUser | undefined {
    try {
      return JWT(localStorage.getItem(JWT_STORAGE_NAMES.access_token) || '')
    } catch (e) {
      return undefined
    }
  }

  async requestPasswordRecovery(forEmail: string) {
    const payload = {
      email: forEmail
    }

    await this.fetcher.post(Pathes.Auth.forgotPassword, payload)
  }

  async validateResetToken(token: string) {
    this.authStore.set('resetPasswordTokenValid', WithRequestMetadata.requested())

    const payload = {
      token: token
    }

    try {
      await this.fetcher.post(Pathes.Auth.validateResetPasswordToken, payload)
      // TODO See if checking result is needed
      this.authStore.set('resetPasswordTokenValid', WithRequestMetadata.data({isValid: true}))
    } catch (err) {
      if (err.message === 'jwt expired') {
        this.authStore.set('resetPasswordTokenValid', WithRequestMetadata.data({message: err.message, isValid: true}))
      } else {
        this.authStore.set('resetPasswordTokenValid', WithRequestMetadata.error(err))
      }
    }
  }

  async sendSignUpActivateLink(token: string) {
    try {
      await this.fetcher.post(Pathes.Auth.sendEmailActivateLink, {token})
    } catch (error) {
      throw new Error(error)
    }
  }

  async sendResetPasswordActivateLink(token: string) {
    try {
      await this.fetcher.post(Pathes.Auth.sendResetPasswordActivateLink, {token})
    } catch (error) {
      throw new Error(error)
    }
  }

  async resetPassword(newPassword: string, token: string) {
    const payload = {
      password: newPassword,
      confirmPassword: newPassword,
      token: token
    }
    try {
      await this.fetcher.post(Pathes.Auth.resetPassword, payload)
    } catch (err) {
      throw err
    }
  }

  // TODO Implement this after implementing on backend
  async refresh(refreshToken: Maybe<string> = this.tokenContainer.refresh_token) {
    this.logOut()
  }

  setHeaders() {
    if (this.checkForExpired(this.tokenContainer.access_token)) {
      this.fetcher.addHeader('Authorization', `Bearer ${this.tokenContainer.access_token}`)
    } else {
      this.fetcher.addHeader('Authorization', undefined)
    }
  }

  persistTokenContainer(tokenContainer: TokenContainer) {
    this.tokenContainer = tokenContainer
    this.setHeaders()
    localStorage.setItem(JWT_STORAGE_NAMES.access_token, tokenContainer.access_token!)
    localStorage.setItem(JWT_STORAGE_NAMES.refresh_token, tokenContainer.refresh_token!)
    this.setIsLogged(!!tokenContainer.access_token)
  }

  setIsLogged = (isLogged: boolean) => {
    this.authStore.set('isLoggedIn', isLogged)
  }

  static loadTokenContainer() {
    return {
      access_token: localStorage.getItem(JWT_STORAGE_NAMES.access_token),
      refresh_token: localStorage.getItem(JWT_STORAGE_NAMES.refresh_token)
    }
  }
}
