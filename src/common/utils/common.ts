export const patch = <T>(target: T, json: Partial<T>) => {
  for (const property in json) {
    if (json.hasOwnProperty(property)) {
      (target as any)[property] = (json as any)[property]
    }
  }
}