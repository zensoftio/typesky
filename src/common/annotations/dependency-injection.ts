import 'reflect-metadata'
import {Container, Injectable, RegistrationEntry, RegistrationType, Resolver} from '../dependency-container'

export const PROPERTY_INJECTIONS = Symbol('property_injections')
export const METHOD_INJECTIONS = Symbol('method_injections')
export const CONSTRUCTOR_INJECTIONS = Symbol('constructor_injections')

// Moved to separate function for better access control
function performInjection(resolver: Resolver, target: Injectable) {
  const propertyInjections: PropertyInjectionRecord[] = Reflect.getMetadata(PROPERTY_INJECTIONS, target) || []
  propertyInjections.forEach(injection => {
    (target as any)[injection.propertyKey] = resolver.resolve(injection.qualifier)
  })

  const methodInjections: MethodInjectionRecord[] = Reflect.getMetadata(METHOD_INJECTIONS, target) || []
  methodInjections.forEach(injection => {
    (target as any)[injection.setterName](resolver.resolve(injection.qualifier))
  })
}

class PropertyInjectionRecord {
  constructor(public qualifier: string, public propertyKey: string) {
  }
}

class MethodInjectionRecord {
  constructor(public qualifier: string, public setterName: string) {
  }
}

class ConstructorInjectionRecord {
  constructor(public qualifier: string, public index: number) {
  }
}

// NOTE: Qualifiers made required to survive minification

export const injectProperty = (qualifier: string) => (target: any, propertyKey: string) => {
  if (!Reflect.hasOwnMetadata(PROPERTY_INJECTIONS, target)) {
    // Handling parent dependencies, if any
    const parentDependencies = Reflect.getMetadata(PROPERTY_INJECTIONS, target) || []
    Reflect.defineMetadata(PROPERTY_INJECTIONS, [...parentDependencies], target)
  }
  const metadata = Reflect.getOwnMetadata(PROPERTY_INJECTIONS, target)
  metadata.push(new PropertyInjectionRecord(qualifier, propertyKey))
}

export const injectMethod = (qualifier: string) => (target: any, setterName: string) => {
  if (!Reflect.hasOwnMetadata(METHOD_INJECTIONS, target)) {
    // Handling parent dependencies, if any
    const parentDependencies = Reflect.getMetadata(METHOD_INJECTIONS, target) || []
    Reflect.defineMetadata(METHOD_INJECTIONS, [...parentDependencies], target)
  }
  const metadata = Reflect.getOwnMetadata(METHOD_INJECTIONS, target)
  metadata.push(new MethodInjectionRecord(qualifier, setterName))
}

// NOTE: This decorator SHOULD NOT be used for components!
export const injectConstructor = (qualifier: string) => (target: any, _: any, index: number) => {
  if (!Reflect.hasOwnMetadata(CONSTRUCTOR_INJECTIONS, target)) {
    Reflect.defineMetadata(CONSTRUCTOR_INJECTIONS, [], target)
  }
  const metadata = Reflect.getOwnMetadata(CONSTRUCTOR_INJECTIONS, target)
  metadata.push(new ConstructorInjectionRecord(qualifier, index))
}

export const injectable = (qualifier: string,
                           registrationType: RegistrationType = RegistrationType.CONTAINER,
                           container: Container = Container.defaultContainer) => (target: any) => {
  // NOTE: For isolation purposes this decorator is disabled in testing mode for default container
  if (process.env.NODE_ENV === 'test' && container === Container.defaultContainer) {
    return target
  }

  const registration = new RegistrationEntry(registrationType, (resolver: Resolver) => {

    const constructorInjectors: ConstructorInjectionRecord[] = Reflect.getOwnMetadata(CONSTRUCTOR_INJECTIONS, target)

    let instance: Injectable

    if (constructorInjectors && constructorInjectors.length > 0) {
      instance = new target(...(constructorInjectors
        .sort((a, b) => (a.index - b.index))
        .map(it => it !== undefined ? resolver.resolve(it.qualifier) : undefined))
      )
    } else {
      instance = new target()
    }

    instance.postConstructor()

    performInjection(resolver, instance)

    instance.awakeAfterInjection()

    return instance
  })

  container.register(qualifier, registration)

  return target
}

export const service = (serviceName: string,
                        registrationType: RegistrationType = RegistrationType.CONTAINER,
                        container: Container = Container.defaultContainer) =>
  injectable(serviceName + 'Service', registrationType, container)

export const mapper = (mapperName: string,
                       registrationType: RegistrationType = RegistrationType.CONTAINER,
                       container: Container = Container.defaultContainer) =>
  injectable(mapperName + 'Mapper', registrationType, container)

export const storage = (storageName: string,
                        registrationType: RegistrationType = RegistrationType.CONTAINER,
                        container: Container = Container.defaultContainer) =>
  injectable(storageName + 'RecordStorage', registrationType, container)

export const INJECT_AWARE = Symbol('inject_aware')

// NOTE: This decorator DOES NOT support injectConstructor entries!
export const injectAware = (container?: Container) => (target: any) => {

  // Same component class should not be decorated as inject-aware twice
  if (Reflect.getOwnMetadata(INJECT_AWARE, target)) {
    return target
  }

  // NOTE: This decorator WILL work during testing to allow component configuration under Jest and React Test Renderer
  const proxy = new Proxy(target, {
    construct(clz, args) {

      const componentContainer = container || Container.containerForComponent(target.name)

      const instance = Reflect.construct(clz, args)

      performInjection(componentContainer, instance)

      instance.awakeAfterInjection && instance.awakeAfterInjection()

      return instance
    }
  })

  Reflect.defineMetadata(INJECT_AWARE, true, proxy)

  return proxy
}
