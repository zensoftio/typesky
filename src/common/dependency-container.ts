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

  private static componentContainers: Map<string, Container> = new Map()

  static containerForComponent(componentName: string): Container {

    // Under non-test environment (e.g. development, production) default container is used for all components.
    if (process.env.NODE_ENV !== 'test') {
      return this.defaultContainer
    }

    const container = this.componentContainers.get(componentName) || new Container()
    this.componentContainers.set(componentName, container)

    return container
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

    return this.getInstance(qualifier) || this.construct(registration, qualifier)
  }

  public register<T extends Injectable>(qualifier: string, registration: RegistrationEntry<T>) {
    if (registration.type !== RegistrationType.TRANSIENT && registration.type !== RegistrationType.CONTAINER) {
      throw new Error(`Invalid registration type ${registration.type}' for qualifier '${qualifier}'`)
    }

    this.registrations.set(qualifier, registration)
  }

  public clear() {
    this.registrations = new Map()
    this.instances = new Map()
  }

  private construct<T extends Injectable>(registration: RegistrationEntry<T>, qualifier: string) {
    const instance = registration.factory(this)

    if (registration.type === RegistrationType.CONTAINER) {
      this.instances.set(qualifier, instance as Injectable)
    }

    return instance
  }
}
