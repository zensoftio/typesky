import {
  CONSTRUCTOR_INJECTIONS, METHOD_INJECTIONS, PROPERTY_INJECTIONS, INJECT_AWARE,
  injectable,
  injectAware, injectConstructor, injectMethod, injectProperty,
  mapper,
  service,
  storage
} from '../../../common/annotations/dependency-injection'

import {Container, Injectable, RegistrationType} from '../../../common/dependency-container'

import * as React from 'react'

describe('Dependency Injection', () => {

  const testInjectionQualifier1 = 'testInjectionQualifier1'
  const testInjectionQualifier2 = 'testInjectionQualifier2'
  const testTargetName = 'Target'

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

      expect(container.resolve(testInjectionQualifier1, testTargetName)).toBeInstanceOf(DependencyMock1)
    })

    it('does not affect default container in test environment', () => {

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT)(DependencyMock1)

      expect(() => Container.defaultContainer.resolve(testInjectionQualifier1, testTargetName))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}' requested by '${testTargetName}'`)
    })

    it('does not affect other containers', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => Container.defaultContainer.resolve(testInjectionQualifier1, testTargetName))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}' requested by '${testTargetName}'`)
    })

    it('registers container-wide dependencies by default', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, undefined, container)(DependencyMock1)

      const instance = container.resolve(testInjectionQualifier1, testTargetName)
      const otherInstance = container.resolve(testInjectionQualifier1, testTargetName)

      expect(otherInstance).toBe(instance)
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

      const instance: DependentEntity = container.resolve(testQualifier, testTargetName)

      expect(instance.testInjection1).toBeInstanceOf(DependencyMock1)
      expect(instance.testInjection2).toBeInstanceOf(DependencyMock2)
    })
  })

  describe('service decorator', () => {

    it('Registers a service', () => {

      const container = new Container()

      service(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const resolvedService = container.resolve(`${testInjectionQualifier1}Service`, testTargetName)

      expect(resolvedService).toBeInstanceOf(DependencyMock1)
    })

    it('Does not register a plain dependency', () => {

      const container = new Container()

      service(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => container.resolve(testInjectionQualifier1, testTargetName))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}' requested by '${testTargetName}'`)
    })

    it('does not affect default container in test environment', () => {

      service(testInjectionQualifier1, RegistrationType.TRANSIENT)(DependencyMock1)

      const expectedQualifier = testInjectionQualifier1 + 'Service'

      expect(() => Container.defaultContainer.resolve(expectedQualifier, testTargetName))
        .toThrow(`No registration for qualifier '${expectedQualifier}'`)
    })

    it('registers container-wide dependencies by default', () => {

      const container = new Container()

      service(testInjectionQualifier1, undefined, container)(DependencyMock1)

      const expectedQualifier = testInjectionQualifier1 + 'Service'

      const instance = container.resolve(expectedQualifier, testTargetName)
      const otherInstance = container.resolve(expectedQualifier, testTargetName)

      expect(otherInstance).toBe(instance)
    })
  })

  describe('mapper decorator', () => {

    it('Registers a mapper', () => {

      const container = new Container()

      mapper(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const resolvedMapper = container.resolve(`${testInjectionQualifier1}Mapper`, testTargetName)

      expect(resolvedMapper).toBeInstanceOf(DependencyMock1)
    })

    it('Does not register a plain dependency', () => {

      const container = new Container()

      mapper(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => container.resolve(testInjectionQualifier1, testTargetName))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}' requested by '${testTargetName}'`)
    })

    it('does not affect default container in test environment', () => {

      mapper(testInjectionQualifier1, RegistrationType.TRANSIENT)(DependencyMock1)

      const expectedQualifier = testInjectionQualifier1 + 'Mapper'

      expect(() => Container.defaultContainer.resolve(expectedQualifier, testTargetName))
        .toThrow(`No registration for qualifier '${expectedQualifier}' requested by '${testTargetName}'`)
    })

    it('registers container-wide dependencies by default', () => {

      const container = new Container()

      mapper(testInjectionQualifier1, undefined, container)(DependencyMock1)

      const expectedQualifier = testInjectionQualifier1 + 'Mapper'

      const instance = container.resolve(expectedQualifier, testTargetName)
      const otherInstance = container.resolve(expectedQualifier, testTargetName)

      expect(otherInstance).toBe(instance)
    })
  })

  describe('storage decorator', () => {

    it('Registers a storage', () => {

      const container = new Container()

      storage(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const resolvedStorage = container.resolve(`${testInjectionQualifier1}RecordStorage`, testTargetName)

      expect(resolvedStorage).toBeInstanceOf(DependencyMock1)
    })

    it('Does not register a plain dependency', () => {

      const container = new Container()

      storage(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      expect(() => container.resolve(testInjectionQualifier1, testTargetName))
        .toThrow(`No registration for qualifier '${testInjectionQualifier1}' requested by '${testTargetName}'`)
    })

    it('does not affect default container in test environment', () => {

      storage(testInjectionQualifier1, RegistrationType.TRANSIENT)(DependencyMock1)

      const expectedQualifier = testInjectionQualifier1 + 'RecordStorage'

      expect(() => Container.defaultContainer.resolve(expectedQualifier, testTargetName))
        .toThrow(`No registration for qualifier '${expectedQualifier}' requested by '${testTargetName}'`)
    })

    it('registers container-wide dependencies by default', () => {

      const container = new Container()

      storage(testInjectionQualifier1, undefined, container)(DependencyMock1)

      const expectedQualifier = testInjectionQualifier1 + 'RecordStorage'

      const instance = container.resolve(expectedQualifier, testTargetName)
      const otherInstance = container.resolve(expectedQualifier, testTargetName)

      expect(otherInstance).toBe(instance)
    })
  })

  describe('injectProperty decorator', () => {

    it('adds injection information to metadata', () => {

      class InjectMock {

        @injectProperty(testInjectionQualifier1) mock: any
        @injectProperty(testInjectionQualifier2) test: any
      }

      const testObject = new InjectMock()

      const metadata = Reflect.getMetadata(PROPERTY_INJECTIONS, testObject)

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

      const metadata = Reflect.getMetadata(METHOD_INJECTIONS, testObject)

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

      const metadata = Reflect.getOwnMetadata(CONSTRUCTOR_INJECTIONS, InjectMock)

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

      expect(Reflect.getOwnMetadata(INJECT_AWARE, InjectAwareClass)).toBeTruthy()
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

    it('uses isolated container in test environment', () => {

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const container = Container.containerForComponent(ComponentClass.name)

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      const InjectAwareClass = injectAware()(ComponentClass)
      const component = new InjectAwareClass()

      expect(component.mock).toBeInstanceOf(DependencyMock1)
    })

    it('handles injectProperty decorators', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      const component = new InjectAwareClass()

      expect(component.mock).toBeInstanceOf(DependencyMock1)
    })

    it('handles injectMethod decorators', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      class ComponentClass extends React.Component {
        dependency: DependencyMock1
        @injectMethod(testInjectionQualifier1) setDependency(d: DependencyMock1) {
          this.dependency = d
        }
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      const component = new InjectAwareClass()

      expect(component.dependency).toBeInstanceOf(DependencyMock1)
    })

    it('calls awakeAfterInjection hook', () => {

      const container = new Container()

      const awakeAfterInjectionMock = jest.fn()

      class ComponentClass extends React.Component {
        awakeAfterInjection = awakeAfterInjectionMock
      }

      const InjectAwareClass = injectAware(container)(ComponentClass)

      new InjectAwareClass()

      expect(awakeAfterInjectionMock.mock.calls.length).toBe(1)
    })

    it('is an idempotent operation', () => {

      const container = new Container()

      injectable(testInjectionQualifier1, RegistrationType.TRANSIENT, container)(DependencyMock1)

      class ComponentClass extends React.Component {
        @injectProperty(testInjectionQualifier1) mock: DependencyMock1
      }

      const InjectAwareClass1 = injectAware(container)(ComponentClass)

      const InjectAwareClass2 = injectAware(container)(InjectAwareClass1)

      expect(Reflect.getOwnMetadata(INJECT_AWARE, InjectAwareClass1)).toBeTruthy()
      expect(InjectAwareClass2).toBe(InjectAwareClass1)
    })

    it('Handles parent class dependencies', () => {

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

      const instance = new InjectAwareChild()

      expect(instance.injection1).toBeInstanceOf(DependencyMock1)
    })

    it('Handles child class dependencies', () => {

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

      const instance = new InjectAwareChild()

      expect(instance.injection2).toBeInstanceOf(DependencyMock2)
    })

    it('Does not inject child dependencies into parent class', () => {

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

      const instance = new InjectAwareParent()

      expect((instance as any).injection2).not.toBeInstanceOf(DependencyMock2)
    })
  })
})
