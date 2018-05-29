import DefaultPostRecordStorage from "../../storages/post/default";

const METHOD_INJECTIONS = Symbol('method_injections')
const CONSTRUCTOR_INJECTIONS = Symbol('constructor_injections')

const constructorRegistry: Map<string, any> = new Map()

class InstanceRegistry {

  map: Map<string, any> = new Map()

  get(key: string) {
    const value = this.map.get(key)

    if (!value) {
      throw new Error(`There is no instance for ${key}!`)
    }

    return value
  }

  set(key: string, value: any) {
    if (this.map.has(key)) {
      throw new Error(`Double implementation for ${key}`)
    }

    this.map.set(key, value)
  }

  forEach(callbackFn: (value: any, key: string, map: Map<string, any>) => void, thisArg?: any) {
    this.map.forEach(callbackFn, thisArg)
  }
}

export const instanceRegistry = new InstanceRegistry()

class MethodInjectionRecord {
  constructor(public qualifier: string, public setter: string) {
  }
}

class ConstructorInjectionRecord {
  constructor(public qualifier: string, public index: number) {
  }
}

export const singleton = (qualifier: string) => (constructor: { new(a?: any, b?: any, c?: any, d?: any): any }) => {
  const constructorInjectors: ConstructorInjectionRecord[] = Reflect.get(constructor, CONSTRUCTOR_INJECTIONS)
  if (constructorInjectors) {
    constructorRegistry.set(qualifier, class extends constructor {
      constructor(instanceRegistry: any) {
        super(
          ...constructorInjectors.map(it => it !== undefined ? instanceRegistry.get(it.qualifier) : undefined)
        )
      }
    })
  }

  if (!constructorInjectors) {
    instanceRegistry.set(qualifier, new constructor())
  }
}

export const injectableDefault = (post = '', pre = '') => (name: string) => (constructor: any) => {
  singleton(`${pre}${name}${post}`)(constructor)
}

export const service = injectableDefault('Service')
export const storage = injectableDefault('RecordStorage')
export const mapper = injectableDefault('Mapper')

export const injectable = singleton

export const injectMethod = (qualifier: string) => (target: any, setterName: string) => {
  if (!Reflect.has(target.constructor, METHOD_INJECTIONS)) {
    Reflect.set(target.constructor, METHOD_INJECTIONS, [])
  }
  Reflect.get(target.constructor, METHOD_INJECTIONS)
         .push(new MethodInjectionRecord(qualifier, setterName))
}

export const injectConst = (qualifier: string) => (constructor: any, _: any, index: number) => {
  if (!Reflect.has(constructor, CONSTRUCTOR_INJECTIONS)) {
    Reflect.set(constructor, CONSTRUCTOR_INJECTIONS, [])
  }
  Reflect.get(constructor, CONSTRUCTOR_INJECTIONS)
         .push(new ConstructorInjectionRecord(qualifier, index))
}

export const disposeInjection = async () => {
  constructorRegistry.forEach((constructor: any, qualifier: string) => {
    instanceRegistry.set(qualifier, new constructor(instanceRegistry))
  })
  instanceRegistry.forEach(target => {
    const registeredInjections: MethodInjectionRecord[] | undefined = Reflect.get(target.constructor, METHOD_INJECTIONS)
    if (registeredInjections) {
      registeredInjections.forEach(injectionRecord => target[injectionRecord.setter](
        instanceRegistry.get(injectionRecord.qualifier)
      ))
    }
  })

  const postConstructorWaiter: any[] = []
  instanceRegistry.forEach(target => postConstructorWaiter.push(target['postConstructor'] ? target['postConstructor']() : null))
  await Promise.all(postConstructorWaiter)

  const onReadyWaiter: any[] = []
  instanceRegistry.forEach(target => onReadyWaiter.push(target['onReady'] ? target['onReady']() : null))
  return Promise.all(onReadyWaiter)
}
