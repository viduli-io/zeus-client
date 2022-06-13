import { Filter } from './mongodb-types'

export function toArrayOrObject(result: any) {
  const resultArray: [Error, null, null, number] | [null, any, any, number] = [
    result.error,
    result.data,
    result.meta,
    result.statusCode,
  ]
  return Object.assign(resultArray, result)
}

export const forceAnd = (
  currentFilter: Filter<any>,
  newFilter: Filter<any>
) => {
  ;(currentFilter.$and ??= []).push(newFilter)
  return currentFilter
}
