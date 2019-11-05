import {WithRequestMetadata} from '@Types'

export interface UserTokenInfo {
  isValid: boolean
  message?: string
}

export interface CurrentUser {
  username: string
  role: string
}

export interface BookingSignUpDTO {
  email: string
  phone: string
  password: string
  lastName: string
  firstName: string
  homeAirportId: string
}

export namespace Auth {
  export interface Records {
    isLoggedIn: boolean
    isActivatedAfterSignUp: WithRequestMetadata<UserTokenInfo>
    resetPasswordTokenValid: WithRequestMetadata<UserTokenInfo>
  }
}
