export default class SimpleBaseModel {
  
  // todo: need to figure out how to do this recursively with respect to type (relations to one/many)
  constructor(json?: any) {
    if (json) {
      Object.keys(json)
            .map(prop => (this as any)[prop] = json[prop])
    }
  }
}