import {
  Container,
  injectable,
  Injectable,
  injectAware, injectProperty,
  mapper,
  RegistrationEntry,
  RegistrationType,
  service,
  storage
} from '../../../../common/annotations/dependency-injection'

import * as React from 'react'

describe('Dependency Injection', () => {

  describe('injectable decorator', () => {

    it('registers injectable items in correct container', () => {

      const container = new Container()

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      const testQualifier = 'TestInjection'

      injectable(testQualifier, RegistrationType.TRANSIENT, container)(InjectableMock)

      expect(() => Container.defaultContainer.resolve(testQualifier))
        .toThrow(`No registration for qualifier '${testQualifier}'`)

      expect(container.resolve(testQualifier)).toBeInstanceOf(InjectableMock)
    })
  })

  describe('service decorators', () => {

    it('Registers a service', () => {

      const container = new Container()

      const testQualifier = 'TestInjection'

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      service(testQualifier, RegistrationType.TRANSIENT, container)(InjectableMock)

      expect(() => container.resolve(testQualifier))
        .toThrow(`No registration for qualifier '${testQualifier}'`)

      const resolvedService = container.resolve(`${testQualifier}Service`)

      expect(resolvedService).toBeInstanceOf(InjectableMock)
    })
  })

  describe('mapper decorators', () => {

    it('Registers a mapper', () => {

      const container = new Container()

      const testQualifier = 'TestInjection'

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      mapper(testQualifier, RegistrationType.TRANSIENT, container)(InjectableMock)

      expect(() => container.resolve(testQualifier))
        .toThrow(`No registration for qualifier '${testQualifier}'`)

      const resolvedMapper = container.resolve(`${testQualifier}Mapper`)

      expect(resolvedMapper).toBeInstanceOf(InjectableMock)
    })
  })

  describe('storage decorators', () => {

    it('Registers a storage', () => {

      const container = new Container()

      const testQualifier = 'TestInjection'

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      storage(testQualifier, RegistrationType.TRANSIENT, container)(InjectableMock)

      expect(() => container.resolve(testQualifier))
        .toThrow(`No registration for qualifier '${testQualifier}'`)

      const resolvedStorage = container.resolve(`${testQualifier}RecordStorage`)

      expect(resolvedStorage).toBeInstanceOf(InjectableMock)
    })
  })

  describe('injectProperty decorator', () => {})
  describe('injectMethod decorator', () => {})
  describe('injectConstructor decorator', () => {})

  describe('injectAware decorator', () => {

    it('sets up injection support for component', () => {

      const container = new Container()

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      const testQualifier = 'TestInjection'

      injectable(testQualifier, RegistrationType.TRANSIENT, container)(InjectableMock)

      class ComponentClass extends React.Component {
        @injectProperty(testQualifier) mock: InjectableMock
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      const component = new InjectAwareClass()

      expect(component).toBeInstanceOf(ComponentClass)
      expect(component.mock).toBeInstanceOf(InjectableMock)
    })
  })

  describe('Container', () => {

    it('registers injectables', () => {

      const container = new Container()

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      const testQualifier = 'TestInjection'

      const registrationEntry =
        new RegistrationEntry(
          RegistrationType.TRANSIENT,
          () => new InjectableMock()
        )

      container.register(testQualifier, registrationEntry)

      expect(container.resolve(testQualifier)).toBeInstanceOf(InjectableMock)
    })

    it('stores container-wide instances', () => {

      const container = new Container()

      const awakeAfterMock = jest.fn()
      const postConstructMock = jest.fn()

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
          awakeAfterMock()
        }

        postConstructor(): void {
          postConstructMock()
        }
      }

      const testQualifier = 'TestInjection'

      const registrationEntry =
        new RegistrationEntry(
          RegistrationType.CONTAINER,
          () => new InjectableMock()
        )

      container.register(testQualifier, registrationEntry)

      const instance = container.resolve(testQualifier)

      expect(instance).toBeInstanceOf(InjectableMock)

      const otherInstance = container.resolve(testQualifier)

      expect(otherInstance).toBe(instance)

      expect(awakeAfterMock.mock.calls.length).toBe(1)
      expect(awakeAfterMock.mock.calls.length).toBe(1)
    })

    it('constructs new transient instances', () => {

      const container = new Container()

      const awakeAfterMock = jest.fn()
      const postConstructMock = jest.fn()

      class InjectableMock implements Injectable {

        awakeAfterInjection(): void {
          awakeAfterMock()
        }

        postConstructor(): void {
          postConstructMock()
        }
      }

      const testQualifier = 'TestInjection'

      const registrationEntry = new RegistrationEntry(RegistrationType.TRANSIENT,
        () => new InjectableMock())

      container.register(testQualifier, registrationEntry)

      const instance = container.resolve(testQualifier)

      expect(instance).toBeInstanceOf(InjectableMock)

      const otherInstance = container.resolve(testQualifier)

      expect(otherInstance).toBeInstanceOf(InjectableMock)

      expect(otherInstance).not.toBe(instance)

      expect(awakeAfterMock.mock.calls.length).toBe(2)
      expect(awakeAfterMock.mock.calls.length).toBe(2)
    })
  })
})
