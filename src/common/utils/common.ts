export const patch = <T>(target: T, json: Partial<T>) => {
  for (const property in json) {
    if (json.hasOwnProperty(property)) {
      (target as any)[property] = (json as any)[property]
    }
  }
}

export const isEmpty = (value: any) => {

  if (value == null || value == undefined) {
    return true
  }
  if (value.prop && value.prop.constructor === Array) {
    return value.length == 0
  }
  else if (typeof value == 'object') {
    return Object.keys(value).length === 0 && value.constructor === Object
  }
  else { // noinspection SuspiciousTypeOfGuard
    if (typeof value == 'string') {
        return value.length == 0
      }
  }

  return false
}
