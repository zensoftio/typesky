import {WithRequestMetadata} from './types'

describe('WithRequestMetadata', () => {
  it('should pass data', () => {
    const tesData = 'test data'
    const testedClass = WithRequestMetadata.data<string>(tesData)
    expect(testedClass.data).toEqual(tesData)
  })

  it('should pass error', () => {
    const error = 'test data'
    const testedClass = WithRequestMetadata.error(new Error(error))
    expect(testedClass.error).toEqual(new Error(error))
  })

  it('should be used requested status', () => {
    const expectedRequestStatus = 'requested'
    const testedClass = WithRequestMetadata.requested()
    expect(testedClass.requestStatus).toEqual(expectedRequestStatus)
  })

  it('should be used requested status for empty method', () => {
    const expectedRequestStatus = 'empty'
    const testedClass = WithRequestMetadata.empty()
    expect(testedClass.requestStatus).toEqual(expectedRequestStatus)
  })

  it('should be used requested status for data method', () => {
    const expectedRequestStatus = 'ready'
    const testedClass = WithRequestMetadata.data<string>('')
    expect(testedClass.requestStatus).toEqual(expectedRequestStatus)
  })

  it('should be used requested status for error method', () => {
    const expectedRequestStatus = 'error'
    const testedClass = WithRequestMetadata.error(new Error())
    expect(testedClass.requestStatus).toEqual(expectedRequestStatus)
  })
})
