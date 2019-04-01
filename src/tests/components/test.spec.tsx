import * as React from 'react'
import * as renderer from 'react-test-renderer'
import {injectAware, injectProperty} from '../../common/annotations/dependency-injection'
import {Container, Injectable, RegistrationEntry, RegistrationType} from '../../common/dependency-container'

describe('Inject-aware Components', () => {

  class MockDependency implements Injectable {
    postConstructor() {
    }

    awakeAfterInjection() {
    }

    mockData: string = 'Mock Data'
  }

  @injectAware()
  class TestComponent extends React.Component<any> {

    @injectProperty('MockDependency')
    mock: MockDependency

    render() {
      const mockData = this.mock.mockData
      return (<span>{mockData}</span>)
    }
  }

  describe('beforeEach-afterEach-centric example', () => {

    beforeEach(() => {

      const container = Container.containerForComponent(TestComponent.name)

      const registration = new RegistrationEntry(RegistrationType.TRANSIENT, () => new MockDependency())

      container.register(MockDependency.name, registration)
    })

    afterEach(() => {
      Container.containerForComponent(TestComponent.name).clear()
    })

    it('Receive dependencies', () => {

      const testRendered = renderer.create(<TestComponent/>)

      const testInstance: TestComponent = testRendered.getInstance()! as any

      expect(testInstance.mock).toBeInstanceOf(MockDependency)
    })
  })

  describe('in-place example', () => {

    it('works with in-place dependencies', () => {

      const container = Container.containerForComponent(TestComponent.name)

      const mockDependency = new MockDependency()

      const registration = new RegistrationEntry(RegistrationType.TRANSIENT, () => mockDependency)

      const testData = 'Test Data'

      container.register(MockDependency.name, registration)

      const testRendered = renderer.create(<TestComponent/>)

      const testInstance: TestComponent = testRendered.getInstance()! as any

      mockDependency.mockData = testData

      expect(testInstance.mock.mockData).toBe(testData)
    })

  })
})
