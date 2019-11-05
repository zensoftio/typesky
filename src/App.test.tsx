import * as React from 'react'
import {App} from './App'
import {shallow} from 'enzyme'
import {AuthMapper, AuthService} from './model/auth'
import {WithRequestMetadata} from './common/types'

describe('App', () => {
  it('should render', () => {
    const mockAuthService: AuthService = {
      requestPasswordRecovery: jest.fn(),
      login: jest.fn(),
      checkUserAuthorised: jest.fn(),
      getAuthInfo: jest.fn(),
      postConstructor: () => {},
      awakeAfterInjection: () => {},
      signUp: jest.fn(),
      sendSignUpActivateLink: jest.fn(),
      sendResetPasswordActivateLink: jest.fn(),
      logOut: jest.fn(),
      checkEmail: jest.fn(),
      activateToken: jest.fn(),
      resetPassword: jest.fn(),
      validateResetToken: jest.fn(),
      setHeaders: jest.fn(),
      bookingSignUp: jest.fn(),
    } as AuthService
    const mockAuthMapper: AuthMapper = {
      postConstructor: () => {},
      awakeAfterInjection: () => {},
      isLoggedIn: undefined,
      resetPasswordTokenValid: WithRequestMetadata.empty(),
      isSignUpTokenActive: WithRequestMetadata.empty()
    }
    const deps = {
      authService: mockAuthService,
      authMapper: mockAuthMapper
    }
    const component = shallow<App>(
      <App deps={deps}/>
    )
    expect(component).toBeTruthy()
  })

  it('should call checkUserAuthorised in componentDidMount', () => {
    const mockCheckUserAuthorised = jest.fn()
    const mockAuthService: AuthService = {
      requestPasswordRecovery: jest.fn(),
      login: jest.fn(),
      checkUserAuthorised: mockCheckUserAuthorised,
      getAuthInfo: jest.fn(),
      postConstructor: () => {},
      awakeAfterInjection: () => {},
      signUp: jest.fn(),
      logOut: jest.fn(),
      sendSignUpActivateLink: jest.fn(),
      sendResetPasswordActivateLink: jest.fn(),
      checkEmail: jest.fn(),
      activateToken: jest.fn(),
      resetPassword: jest.fn(),
      validateResetToken: jest.fn(),
      setHeaders: jest.fn(),
    } as any
    const mockAuthMapper: AuthMapper = {
      postConstructor: () => {},
      awakeAfterInjection: () => {},
      isLoggedIn: undefined,
      resetPasswordTokenValid: WithRequestMetadata.empty(),
      isSignUpTokenActive: WithRequestMetadata.empty()
    }
    const deps = {
      authService: mockAuthService,
      authMapper: mockAuthMapper
    }
    const component = new App({deps})
    component.componentDidMount()
    expect(mockCheckUserAuthorised).toHaveBeenCalledTimes(1)
  })
})
