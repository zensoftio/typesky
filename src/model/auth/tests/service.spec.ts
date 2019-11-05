import {Fetcher} from '../../fetcher'
import DefaultAuthService from '../service'


describe('test authService', () => {

  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  const mockFetcher: Fetcher = {
    addHeader: jest.fn() as (name: string, value: string) => void,
    get: jest.fn() as (url: string, body?: any, schema?: Function) => Promise<any>,
    post: jest.fn((url: string, body?: any, schema?: Function) => {
      return Promise.resolve({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Wrong password or email'
      })
    }) as (url: string, body?: any, schema?: Function) => Promise<any>,
    put: jest.fn() as (url: string, body?: any, schema?: Function) => Promise<any>,
    delete: jest.fn() as (url: string, body?: any, schema?: Function) => Promise<any>,
  }

  let store: any
  let authService: any

  beforeEach(() => {
    store = {
      set: jest.fn(),
      get: jest.fn(),
      clear: jest.fn(),
      getWithDefault: jest.fn(),
      awakeAfterInjection: jest.fn(),
      postConstructor: jest.fn()
    }

    authService = new DefaultAuthService(store)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authService)
  })

  describe('should correct exception login method', () => {

    it('should correct exception signUp method', () => {
      authService.setFetcher(mockFetcher)
      authService.signUp({
        email: 'test@test.com',
        password: 'string',
        firstName: 'string',
        lastName: 'string',
        phone: 'string',
        acceptTerms: true,
        countryCode: 'string'
      })
        .catch((e: any) => expect(e).toEqual(new Error('Something went wrong')))
    })

    it('should correct exception activateToken method', () => {
      const setMock = store.set
      authService.activateToken('test token')
      expect(setMock.mock.calls[0][0]).toEqual('isActivatedAfterSignUp')
      expect(setMock.mock.calls[0][1].data).toEqual({isValid: false})
    })

    it('should correct exception checkEmail method', async () => {
      const expectedError = 'The email is already taken. Please Sign In'
      const fetcherMock = {
        post: jest.fn().mockReturnValueOnce(Promise.reject(new Error(expectedError)))
      } as any
      authService.setFetcher(fetcherMock)
      try {
        await authService.checkEmail('test@test.com')
      } catch (err) {
        expect(err.message).toEqual(expectedError)
      }
    })

    it('should correct exception checkUserAuthorised method', () => {
      const setMock = store.set
      authService.checkUserAuthorised()
      expect(setMock.mock.calls[0][0]).toEqual('isLoggedIn')
      expect(setMock.mock.calls[0][1]).toEqual(false)
    })

    it('should correct exception checkForExpired method', () => {
      const actual = authService.checkForExpired(testToken)
      expect(actual).toEqual(false)

    })

    it('should call getCurrentDateInTimestamp method', () => {
      const actual = authService.getCurrentDateInTimestamp()
      const expectValue = Number((new Date().getTime() / 1000).toString().split('.')[0])
      expect(actual).toEqual(expectValue)
    })

    it('should test isLogged method', () => {
      const actual = authService.checkUserAuthorised()
      expect(actual).toEqual(undefined)
    })

    it('should correct getAuthInfo method', () => {
      localStorage.setItem('JWT_TOKEN', testToken)
      const actual = authService.getAuthInfo() as {name: string}
      expect(actual.name).toBeTruthy()
      localStorage.setItem('JWT_TOKEN', '')
    })

    it('should correct persistTokenContainer method', () => {
      const setMock = store.set
      authService.setFetcher(mockFetcher)
      authService.persistTokenContainer({
        access_token: testToken,
        refresh_token: testToken,
      })
      const actual = setMock.mock.calls[0]
      expect(actual[0]).toEqual('isLoggedIn')
      expect(actual[1]).toEqual(true)
    })

    it('should correct setIsLogged method', () => {
      const setMock = store.set
      authService.setIsLogged(true)
      const actual = setMock.mock.calls[0]
      expect(actual[0]).toEqual('isLoggedIn')
      expect(actual[1]).toEqual(true)
    })

    it('should correct loadTokenContainer method', () => {
      localStorage.setItem('JWT_TOKEN', testToken)
      localStorage.setItem('JWT_REFRESH_TOKEN', testToken)
      DefaultAuthService.loadTokenContainer()
      const actual = {
        access_token: testToken,
        refresh_token: testToken,
      }
      expect(actual).toEqual(DefaultAuthService.loadTokenContainer())
      localStorage.setItem('JWT_TOKEN', '')
      localStorage.setItem('JWT_REFRESH_TOKEN', '')
    })
  })
})
