import 'reflect-metadata'

export enum RegistrationType {
  TRANSIENT, // new instance is created on every resolution
  CONTAINER  // instance created on first resolution is retained by the container becoming a container-wide singleton
}

/**
 * Core protocol for injectable entities
 */
export interface Injectable extends Object {
  /**
   * Called by container after constructor, but before property/method injections
   */
  postConstructor(): void;

  /**
   * Called by container after all property/method injections
   */
  awakeAfterInjection(): void;
}

export interface Resolver {
  resolve<T extends Injectable>(qualifier: string): T;
}

export class RegistrationEntry<T extends Injectable> {
  constructor(readonly type: RegistrationType, readonly factory: (resolver: Resolver) => T) {
  }
}

export class Container implements Resolver {

  private static internalContainer = new Container()

  static get defaultContainer(): Container {
    return this.internalContainer
  }

  private static componentContainers: Map<string, Container> = new Map();

  static containerForComponent(componentName: string): Container {

    // Under non-test environment (e.g. development, production) default container is used for all components.
    if (process.env.NODE_ENV !== 'test') {
      return this.defaultContainer
    }

    const container = this.componentContainers.get(componentName) || new Container()
    this.componentContainers.set(componentName, container)

    return container;
  }

  private registrations: Map<string, RegistrationEntry<any>> = new Map()
  private instances: Map<string, Injectable> = new Map()

  private getInstance<T extends Injectable>(qualifier: string): T {

    return this.instances.get(qualifier) as T
  }

  public resolve<T extends Injectable>(qualifier: string): T {

    const registration = this.registrations.get(qualifier)

    if (!registration) {
      throw new Error(`No registration for qualifier '${qualifier}'`)
    }

    if (registration.type === RegistrationType.CONTAINER) {

      return this.getInstance(qualifier) || this.construct(registration, qualifier)

    } else if (registration.type === RegistrationType.TRANSIENT) {

      return this.construct(registration, qualifier)

    } else {

      throw new Error(`Invalid registration type ${registration.type}' for qualifier '${qualifier}'`)
    }
  }

  public register<T extends Injectable>(qualifier: string, registration: RegistrationEntry<T>) {
    this.registrations.set(qualifier, registration)
  }

  public clear() {
    this.registrations = new Map()
    this.instances = new Map()
  }

  private construct<T extends Injectable>(registration: RegistrationEntry<T>, qualifier: string) {
    const instance = registration.factory(this)
    instance.postConstructor()

    if (registration.type === RegistrationType.CONTAINER) {
      this.instances.set(qualifier, instance as Injectable)
    }

    performInjection(this, instance)
    instance.awakeAfterInjection()

    return instance
  }
}

// Moved to separate function for better access control
function performInjection(resolver: Resolver, target: Injectable) {
  const propertyInjections: PropertyInjectionRecord[] = Reflect.get(target, PROPERTY_INJECTIONS) || []
  propertyInjections.forEach(injection => {
    (target as any)[injection.propertyKey] = resolver.resolve(injection.qualifier)
  })

  const methodInjections: MethodInjectionRecord[] = Reflect.get(target, METHOD_INJECTIONS) || []
  methodInjections.forEach(injection => {
    (target as any)[injection.setterName](resolver.resolve(injection.qualifier))
  })
}

export const PROPERTY_INJECTIONS = Symbol('property_injection')
export const METHOD_INJECTIONS = Symbol('method_injections')
export const CONSTRUCTOR_INJECTIONS = Symbol('constructor_injections')

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
  if (!Reflect.has(target, PROPERTY_INJECTIONS)) {
    Reflect.set(target, PROPERTY_INJECTIONS, [])
  }
  Reflect.get(target, PROPERTY_INJECTIONS)
    .push(new PropertyInjectionRecord(qualifier, propertyKey))
}

export const injectMethod = (qualifier: string) => (target: any, setterName: string) => {
  if (!Reflect.has(target, METHOD_INJECTIONS)) {
    Reflect.set(target, METHOD_INJECTIONS, [])
  }
  Reflect.get(target, METHOD_INJECTIONS)
    .push(new MethodInjectionRecord(qualifier, setterName))
}

// NOTE: This decorator SHOULD NOT be used for components!
export const injectConstructor = (qualifier: string) => (target: any, _: any, index: number) => {
  if (!Reflect.has(target, CONSTRUCTOR_INJECTIONS)) {
    Reflect.set(target, CONSTRUCTOR_INJECTIONS, [])
  }
  Reflect.get(target, CONSTRUCTOR_INJECTIONS)
    .push(new ConstructorInjectionRecord(qualifier, index))
}

export const injectable = (qualifier: string,
                           registrationType: RegistrationType = RegistrationType.CONTAINER,
                           container: Container = Container.defaultContainer) => (target: any) => {
  // NOTE: For isolation purposes this decorator is disabled in testing mode for default container
  if (process.env.NODE_ENV === 'test' && container === Container.defaultContainer) {
    return target
  }

  const registration = new RegistrationEntry(registrationType, (resolver: Resolver) => {

    const constructorInjectors: ConstructorInjectionRecord[] = Reflect.get(target, CONSTRUCTOR_INJECTIONS)

    if (constructorInjectors && constructorInjectors.length > 0) {
      return new target(...(constructorInjectors
        .sort((a, b) => (a.index - b.index))
        .map(it => it !== undefined ? resolver.resolve(it.qualifier) : undefined))
      )
    } else {
      return new target()
    }
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
  if (target.hasOwnProperty(INJECT_AWARE) && Reflect.get(target, INJECT_AWARE)) {
    return target
  }

  // NOTE: This decorator WILL work during testing to allow component configuration under Jest and React Test Renderer
  const proxy = new Proxy(target, {
    construct(clz, args) {

      const componentContainer = container || Container.containerForComponent(target.name)

      const instance = Reflect.construct(clz, args)

      performInjection(componentContainer, instance)

      instance.awakeAfterInjection && instance.awakeAfterInjection();

      return instance
    }
  })

  Reflect.set(proxy, INJECT_AWARE, true)

  return proxy
}
