import { IApiClient } from './ApiClient'
import { CollectionQueryBuilder } from './CollectionQueryBuilder'
import { Filter } from './mongodb-types'

export class CollectionFilterBuilder<TDoc extends { id: string }> {
  public eq = this.createOperator('$eq')
  public ne = this.createOperator('$ne')
  public gt = this.createOperator('$gt')
  public gte = this.createOperator('$gte')
  public lt = this.createOperator('$lt')
  public lte = this.createOperator('$lte')
  public in = this.createOperator<any[]>('$in')
  public nin = this.createOperator<any[]>('$nin')
  public exists = this.createOperator<boolean>('$exists')
  public mod = this.createOperator<[ number, number ]>('$mod')
  public regex = this.createOperator('$regex')

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
