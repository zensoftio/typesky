import {
  CONSTRUCTOR_INJECTIONS,
  Container,
  injectable,
  Injectable,
  injectAware, injectConstructor, injectMethod, injectProperty,
  mapper, METHOD_INJECTIONS, PROPERTY_INJECTIONS,
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

    it('handles constructor injections', () => {

      const container = new Container()

      const testQualifier1 = 'TestQualifier1'
      const testQualifier2 = 'TestQualifier2'

      @injectable(testQualifier1, RegistrationType.TRANSIENT, container)
      class TestInjection1 implements Injectable {
        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      @injectable(testQualifier2, RegistrationType.TRANSIENT, container)
      class TestInjection2 implements Injectable {
        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      class InjectableMock implements Injectable {

        constructor(@injectConstructor(testQualifier1) public testInjection1: TestInjection1,
                    @injectConstructor(testQualifier2) public testInjection2: TestInjection2, ) {
        }

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      const testQualifier = 'TestInjection'

      injectable(testQualifier, RegistrationType.TRANSIENT, container)(InjectableMock)

      const instance: InjectableMock = container.resolve(testQualifier)

      expect(instance.testInjection1).toBeInstanceOf(TestInjection1)
      expect(instance.testInjection2).toBeInstanceOf(TestInjection2)
    })
  })

  describe('service decorator', () => {

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

  describe('mapper decorator', () => {

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

  describe('storage decorator', () => {

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

  describe('injectProperty decorator', () => {

    it('adds injection information to metadata', () => {

      const testQualifier1 = 'TestInjection1'
      const testQualifier2 = 'TestInjection1'

      class InjectMock {

        @injectProperty(testQualifier1) mock: any
        @injectProperty(testQualifier2) test: any
      }

      const testObject = new InjectMock()

      const metadata = Reflect.get(testObject, PROPERTY_INJECTIONS)

      expect(metadata.length).toBe(2)

      expect(metadata[0].qualifier).toBe(testQualifier1)
      expect(metadata[0].propertyKey).toBe('mock')

      expect(metadata[1].qualifier).toBe(testQualifier2)
      expect(metadata[1].propertyKey).toBe('test')
    })
  })

  describe('injectMethod decorator', () => {

    it('adds injection information to metadata', () => {

      const testQualifier1 = 'TestInjection1'
      const testQualifier2 = 'TestInjection2'

      class InjectMock {

        @injectMethod(testQualifier1) setMock(mock: any) {
        }

        @injectMethod(testQualifier2) setTest(test: any) {
        }
      }

      const testObject = new InjectMock()

      const metadata = Reflect.get(testObject, METHOD_INJECTIONS)

      expect(metadata.length).toBe(2)

      expect(metadata[0].qualifier).toBe(testQualifier1)
      expect(metadata[0].setterName).toBe('setMock')

      expect(metadata[1].qualifier).toBe(testQualifier2)
      expect(metadata[1].setterName).toBe('setTest')
    })
  })

  describe('injectConstructor decorator', () => {

    it('adds injection information to metadata', () => {

      const testQualifier = 'TestInjection1'

      class InjectMock {

        mock: any

        constructor(@injectConstructor(testQualifier) mock: any) {
          this.mock = mock
        }
      }

      const metadata = Reflect.get(InjectMock, CONSTRUCTOR_INJECTIONS)

      expect(metadata.length).toBe(1)

      expect(metadata[0].qualifier).toBe(testQualifier)
      expect(metadata[0].index).toBe(0)

    })
  })

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
