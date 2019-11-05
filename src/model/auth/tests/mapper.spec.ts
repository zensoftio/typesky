import DefaultAuthMapper from '../mapper'
import {WithRequestMetadata} from '../../../common/types'

describe('Auth Mapper', () => {

  it('should be defined', () => {
    const mockStorage = {} as any

    const mapper = new DefaultAuthMapper(mockStorage)

    expect(mapper).toBeDefined()
  })

  describe('when accessing values from storage', () => {

    it('passes isActivatedAfterSignUp value from store unchanged', () => {
      const testValue = WithRequestMetadata.requested()
      const getWithDefaultMock = jest.fn().mockReturnValue({_ : testValue})
      const mockStorage = {
        getWithDefault: getWithDefaultMock
      } as any

      const mapper = new DefaultAuthMapper(mockStorage)
      const value = mapper.isSignUpTokenActive

      expect(getWithDefaultMock.mock.calls.length).toBe(1)
      expect(getWithDefaultMock.mock.calls[0][0]).toBe('isActivatedAfterSignUp')
      expect(value).toBe(testValue)
    })

    it('passes resetPasswordTokenValid value from store unchanged', () => {
      const testValue = WithRequestMetadata.requested()
      const getWithDefaultMock = jest.fn().mockReturnValue({_ : testValue})
      const mockStorage = {
        getWithDefault: getWithDefaultMock
      } as any

      const mapper = new DefaultAuthMapper(mockStorage)
      const value = mapper.resetPasswordTokenValid

      expect(getWithDefaultMock.mock.calls.length).toBe(1)
      expect(getWithDefaultMock.mock.calls[0][0]).toBe('resetPasswordTokenValid')
      expect(value).toBe(testValue)
    })
  })
})
