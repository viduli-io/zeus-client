export function toArrayOrObject(result: any) {
  const resultArray: [ Error, null ] | [ null, any ] = [ result.error, result.data ]
  return Object.assign(resultArray, result)
}

export const isSpecified = <T = any>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined

export const thatWhichIs = <T = any>(value: T | null | undefined, other: any) =>
  isSpecified(value) ? value : other
