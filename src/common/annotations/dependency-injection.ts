import 'reflect-metadata'
import * as React from 'react'

export enum RegistrationType {
  TRANSIENT, // new instance is created on every resolution
  CONTAINER  // instance created on first resolution is retained by the container becoming a container-wide singleton
}

export interface Injectable extends Object {
  /**
   * Called by container after constructor, but before property/method injections
   */
  postConstructor(): void;

  /**
   * Called by container after all property/method injections
   */
  awakeAfterInjection(): void;

  [key: string]: any;
}

export interface Resolver {
  resolve<T extends Injectable>(qualifier: string): T;
}

class RegistrationEntry<T extends Injectable> {
  constructor(readonly type: RegistrationType, readonly factory: (resolver: Resolver) => T) {
  }
}

export class Container implements Resolver {

  static defaultContainer: Container = new Container()

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

  public register<T extends Injectable>(qualifier: string, registration: RegistrationEntry<T>) {
    this.registrations.set(qualifier, registration)
  }

  public clear() {
    this.registrations = new Map()
    this.instances = new Map()
  }
}

// Moved to separate function for better access control
function performInjection(resolver: Resolver, target: Injectable) {
  const propertyInjections: PropertyInjectionRecord[] = Reflect.get(target, PROPERTY_INJECTIONS) || []
  propertyInjections.forEach(injection => {
    target[injection.propertyKey] = resolver.resolve(injection.qualifier)
  })

  const methodInjections: MethodInjectionRecord[] = Reflect.get(target, METHOD_INJECTIONS) || []
  methodInjections.forEach(injection => {
    target[injection.setterName](resolver.resolve(injection.qualifier))
  })
}

const PROPERTY_INJECTIONS = Symbol('property_injection')
const METHOD_INJECTIONS = Symbol('method_injections')
const CONSTRUCTOR_INJECTIONS = Symbol('constructor_injections')

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
  if (process.env.IS_MOCK) {
    return
  }

  if (!Reflect.has(target, PROPERTY_INJECTIONS)) {
    Reflect.set(target, PROPERTY_INJECTIONS, [])
  }
  Reflect.get(target, PROPERTY_INJECTIONS)
    .push(new PropertyInjectionRecord(qualifier, propertyKey))
}

export const injectMethod = (qualifier: string) => (target: any, setterName: string) => {
  if (process.env.IS_MOCK) {
    return
  }

  if (!Reflect.has(target, METHOD_INJECTIONS)) {
    Reflect.set(target, METHOD_INJECTIONS, [])
  }
  Reflect.get(target, METHOD_INJECTIONS)
    .push(new MethodInjectionRecord(qualifier, setterName))
}

export const injectConstructor = (qualifier: string) => (target: any, _: any, index: number) => {
  if (process.env.IS_MOCK) {
    return
  }

  if (!Reflect.has(target, CONSTRUCTOR_INJECTIONS)) {
    Reflect.set(target, CONSTRUCTOR_INJECTIONS, [])
  }
  Reflect.get(target, CONSTRUCTOR_INJECTIONS)
    .push(new ConstructorInjectionRecord(qualifier, index))
}

export const injectable = (qualifier: string, registrationType: RegistrationType = RegistrationType.CONTAINER) => (target: any) => {

  // NOTE: THis annotation WILL NOT work under testing conditions for isolation purposes.
  if (process.env.IS_MOCK) {
    return target
  }

  const registration = new RegistrationEntry(registrationType, (resolver: Resolver) => {

    const constructorInjectors: ConstructorInjectionRecord[] = Reflect.get(target, CONSTRUCTOR_INJECTIONS)

    if (constructorInjectors && constructorInjectors.length > 0) {
      return new target(...constructorInjectors.map(it => it !== undefined ? resolver.resolve(it.qualifier) : undefined))
    } else {
      return new target()
    }
  })

  Container.defaultContainer.register(qualifier, registration)

  return target
}

export const service = (serviceName: string, registrationType: RegistrationType = RegistrationType.CONTAINER) =>
  injectable(serviceName + 'Service', registrationType)

export const mapper = (mapperName: string, registrationType: RegistrationType = RegistrationType.CONTAINER) =>
  injectable(mapperName + 'Mapper', registrationType)

export const storage = (storageName: string, registrationType: RegistrationType = RegistrationType.CONTAINER) =>
  injectable(storageName + 'RecordStorage', registrationType)

export const injectAware = (target: { new(props: any, context: any): React.Component }) => {

  // NOTE: This annotation will work under testing conditions to allow proper component configuration under Jest

  return class extends target {

    constructor(props: any, context: any) {
      super(props, context)
      performInjection(Container.defaultContainer, this as any)
    }
  } as any
}
