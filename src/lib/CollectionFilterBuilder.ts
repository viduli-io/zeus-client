import { IApiClient } from './ApiClient'
import { CollectionQueryBuilder } from './CollectionQueryBuilder'
import { Filter } from './mongodb-types'

export class CollectionFilterBuilder<TDoc extends { id: string }> {
  public eq = createOperator('$eq')
  public ne = createOperator('$ne')
  public gt = createOperator('$gt')
  public gte = createOperator('$gte')
  public lt = createOperator('$lt')
  public lte = createOperator('$lte')
  public in = createOperator<any[]>('$in')
  public nin = createOperator<any[]>('$nin')
  public exists = createOperator<boolean>('$exists')
  public mod = createOperator<[ number, number ]>('$mod')
  public regex = createOperator('$regex')

  constructor(
    protected _client: IApiClient,
    protected _documentEndpoint: string,
    protected _filters: Filter<TDoc>
  ) {
  }

  get filters() {
    return this._filters
  }

  public geoIntersects(field: string, $geometry: any) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: {
        $geoIntersects: { $geometry },
      },
    })
  }

  private createOperator<TValue = any, TOp extends string = string>(op: TOp) {
    return (field: string, value: TValue) =>
      new CollectionQueryBuilder(this._client, this._documentEndpoint, {
        ...this._filters,
        [field]: { [op]: value },
      })
  }
}


function createOperator<TValue = any, TOp extends string = string>(op: TOp) {
  return function (this: CollectionQueryBuilder<any>, field: string, value: TValue) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { [op]: value },
    })
  }
}
