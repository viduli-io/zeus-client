export function toArrayOrObject(result: any) {
  const resultArray: [ Error, null ] | [ null, any ] = [ result.error, result.data ]
  return Object.assign(resultArray, result)
}