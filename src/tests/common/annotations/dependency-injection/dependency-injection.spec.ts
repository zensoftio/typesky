import {
  CONSTRUCTOR_INJECTIONS, METHOD_INJECTIONS, PROPERTY_INJECTIONS, INJECT_AWARE,
  Container,
  RegistrationEntry,
  RegistrationType,
  Injectable,
  injectable,
  injectAware, injectConstructor, injectMethod, injectProperty,
  mapper,
  service,
  storage
} from '../../../../common/annotations/dependency-injection'

import * as React from 'react'

describe('Dependency Injection', () => {

  const testInjectionQualifier1 = 'testInjectionQualifier1'
  const testInjectionQualifier2 = 'testInjectionQualifier2'

  class DependencyMock1 implements Injectable {

    awakeAfterInjection(): void {
    }

    postConstructor(): void {
    }
  }

  class DependencyMock2 implements Injectable {

    awakeAfterInjection(): void {
    }

    postConstructor(): void {
    }
  }

  describe('injectable decorator', () => {

    it('registers injectable items in provided container', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(container.resolve(testInjectionQualifier1)).toBeInstanceOf(DependencyMock1)
    })

    it('does not affect other containers', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => Container.defaultContainer.resolve(testInjectionQualifier1))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}'`)
    })

    it('works with container to handle constructor injections', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)
      injectable(testInjectionQualifier2, RegistrationType.TRANSIENT, container)(DependencyMock2)

      class DependentEntity implements Injectable {

        constructor(@injectConstructor(testInjectionQualifier1) public testInjection1: DependencyMock1,
                    @injectConstructor(testInjectionQualifier2) public testInjection2: DependencyMock2) {
        }

        awakeAfterInjection(): void {
        }

        postConstructor(): void {
        }
      }

      const testQualifier = 'TestInjection'

      injectable(testQualifier, RegistrationType.TRANSIENT, container)(DependentEntity)

      const instance: DependentEntity = container.resolve(testQualifier)

      expect(instance.testInjection1).toBeInstanceOf(DependencyMock1)
      expect(instance.testInjection2).toBeInstanceOf(DependencyMock2)
    })
  })

  describe('service decorator', () => {

    it('Registers a service', () => {

      const container = new Container()

      service(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const resolvedService = container.resolve(`${testInjectionQualifier1}Service`)

      expect(resolvedService).toBeInstanceOf(DependencyMock1)
    })

    it('Does not register a plain dependency', () => {

      const container = new Container()

      service(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => container.resolve(testInjectionQualifier1))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}'`)
    })
  })

  describe('mapper decorator', () => {

    it('Registers a mapper', () => {

      const container = new Container()

      mapper(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const resolvedMapper = container.resolve(`${testInjectionQualifier1}Mapper`)

      expect(resolvedMapper).toBeInstanceOf(DependencyMock1)
    })

    it('Does not register a plain dependency', () => {

      const container = new Container()

      mapper(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => container.resolve(testInjectionQualifier1))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}'`)
    })
  })

  describe('storage decorator', () => {

    it('Registers a storage', () => {

      const container = new Container()

      storage(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const resolvedStorage = container.resolve(`${testInjectionQualifier1}RecordStorage`)

      expect(resolvedStorage).toBeInstanceOf(DependencyMock1)
    })

    it('Does not register a plain dependency', () => {

      const container = new Container()

      storage(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => container.resolve(testInjectionQualifier1))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}'`)
    })
  })

  describe('injectProperty decorator', () => {

    it('adds injection information to metadata', () => {

      class InjectMock {

        @injectProperty(testInjectionQualifier1) mock: any
        @injectProperty(testInjectionQualifier2) test: any
      }

      const testObject = new InjectMock()

      const metadata = Reflect.get(testObject, PROPERTY_INJECTIONS)

      expect(metadata.length).toBe(2)

      expect(metadata[0].qualifier).toBe(testInjectionQualifier1)
      expect(metadata[0].propertyKey).toBe('mock')

      expect(metadata[1].qualifier).toBe(testInjectionQualifier2)
      expect(metadata[1].propertyKey).toBe('test')
    })
  })

  describe('injectMethod decorator', () => {

    it('adds injection information to metadata', () => {

      class InjectMock {

        @injectMethod(testInjectionQualifier1) setMock(mock: any) {
        }

        @injectMethod(testInjectionQualifier2) setTest(test: any) {
        }
      }

      const testObject = new InjectMock()

      const metadata = Reflect.get(testObject, METHOD_INJECTIONS)

      expect(metadata.length).toBe(2)

      expect(metadata[0].qualifier).toBe(testInjectionQualifier1)
      expect(metadata[0].setterName).toBe('setMock')

      expect(metadata[1].qualifier).toBe(testInjectionQualifier2)
      expect(metadata[1].setterName).toBe('setTest')
    })
  })

  describe('injectConstructor decorator', () => {

    it('adds injection information to metadata', () => {

      class InjectMock {

        mock: any

        constructor(@injectConstructor(testInjectionQualifier1) mock: any) {
          this.mock = mock
        }
      }

      const metadata = Reflect.get(InjectMock, CONSTRUCTOR_INJECTIONS)

      expect(metadata.length).toBe(1)

      expect(metadata[0].qualifier).toBe(testInjectionQualifier1)
      expect(metadata[0].index).toBe(0)

    })
  })

  describe('injectAware decorator', () => {

    it('marks decorated class as inject-aware', () => {

      const container = new Container()

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      expect(Reflect.get(InjectAwareClass, INJECT_AWARE)).toBeTruthy()
    })

    it('creates a valid proxy class from decorated component', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      const component = new InjectAwareClass()

      expect(component).toBeInstanceOf(ComponentClass)
    })

    it('sets up injection mechanism for decorated component', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      const component = new InjectAwareClass()

      expect(component.mock).toBeInstanceOf(DependencyMock1)
    })

    it('is an idempotent operation', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const InjectAwareClass1 = injectAware(container)(ComponentClass)

      const InjectAwareClass2 = injectAware(container)(InjectAwareClass1)

      expect(Reflect.get(InjectAwareClass1, INJECT_AWARE)).toBeTruthy()
      expect(InjectAwareClass2).toBe(InjectAwareClass1)
    })

    it('works correctly for subclasses', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)
      injectable(testInjectionQualifier2, RegistrationType.TRANSIENT, container)(DependencyMock2)

      @injectAware(container)
      class InjectAwareParent {
        @injectProperty(testInjectionQualifier1) injection1: DependencyMock1
      }

      @injectAware(container)
      class InjectAwareChild extends InjectAwareParent {
        @injectProperty(testInjectionQualifier2) injection2: DependencyMock2
      }

      const childInstance = new InjectAwareChild()

      expect(childInstance.injection1).toBeInstanceOf(DependencyMock1)
      expect(childInstance.injection2).toBeInstanceOf(DependencyMock2)
    })
  })

  describe('Container', () => {

    it('throws error if no registration provided', () => {

      const container = new Container()

      const testQualifier = 'TestInjection'

      expect(() => {
        container.resolve(testQualifier)
      }).toThrow(`No registration for qualifier '${testQualifier}'`)
    })

    it('registers injectable entities', () => {

      const container = new Container()

      const registrationEntry =
        new RegistrationEntry(
          RegistrationType.TRANSIENT,
          () => new DependencyMock1()
        )

      container.register(testInjectionQualifier1, registrationEntry)

      expect(container.resolve(testInjectionQualifier1)).toBeInstanceOf(DependencyMock1)
    })

    it('calls \'postConstructor\' method during instance creation', () => {

      const container = new Container()

      const postConstructMock = jest.fn()

      @injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)
      class InjectableMock implements Injectable {

        awakeAfterInjection() {
        }

        postConstructor = postConstructMock
      }

      container.resolve(testInjectionQualifier1)

      expect(postConstructMock.mock.calls.length).toBe(1)
    })

    it('calls \'awakeAfterInjection\' method during instance creation', () => {

      const container = new Container()

      const awakeAfterInjectionMock = jest.fn()

      @injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)
      class InjectableMock implements Injectable {

        awakeAfterInjection = awakeAfterInjectionMock

        postConstructor() {
        }
      }

      container.resolve(testInjectionQualifier1)

      expect(awakeAfterInjectionMock.mock.calls.length).toBe(1)
    })

    it('stores container-wide instances', () => {

      const container = new Container()

      const registrationEntry =
        new RegistrationEntry(
          RegistrationType.CONTAINER,
          () => new DependencyMock1()
        )

      container.register(testInjectionQualifier1, registrationEntry)

      const instance = container.resolve(testInjectionQualifier1)
      const otherInstance = container.resolve(testInjectionQualifier1)

      expect(otherInstance).toBe(instance)
    })

    it('constructs new transient instances', () => {

      const container = new Container()
      const registrationEntry = new RegistrationEntry(RegistrationType.TRANSIENT,
        () => new DependencyMock1())

      container.register(testInjectionQualifier1, registrationEntry)

      const instance = container.resolve(testInjectionQualifier1)
      const otherInstance = container.resolve(testInjectionQualifier1)

      expect(otherInstance).not.toBe(instance)
    })
  })
})
