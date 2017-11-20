import {action} from 'mobx'

export default class SimpleBaseModel {
  
  toJson(): Object {
    return JSON.parse(JSON.stringify(this))
  }
  
  @action
  fromJson(json: Object) {
    for (const property in json) {
      if (json.hasOwnProperty(property)) {
        (this as any)[property] = (json as any)[property]
      }
    }
    return this
  }
}