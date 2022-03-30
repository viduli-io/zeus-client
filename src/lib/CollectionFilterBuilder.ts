import type { Filter } from "mongodb"
import type { IApiClient } from "./ApiClient"
import { FindResult } from "./types"


export class CollectionFilterBuilder<TDoc> implements PromiseLike<FindResult<TDoc>> {
  private _skip: number | undefined
  private _limit: number | undefined

  constructor(
    private _client: IApiClient,
    private _documentEndpoint: string,
    private _filters: Filter<TDoc>
  ) {
  }

  eq = this.createOperator('$eq')

  ne = this.createOperator('$ne')

  gt = this.createOperator('$gt')

  gte = this.createOperator('$gte')

  lt = this.createOperator('$lt')

  lte = this.createOperator('$lte')

  public in = this.createOperator<any[]>('$in')

  nin = this.createOperator<any[]>('$nin')

  // TODO: implement this
  // not(action: (builder: CollectionFilterBuilder<TDoc>) => void) {
  //   action(this)
  //
  //   this._filters = { ...this._filters, }
  // }

  exists = this.createOperator<boolean>('$exists')

  mod = this.createOperator<[ number, number ]>('$mod')

  regex = this.createOperator('$regex')

  geoIntersects(field: string, $geometry: any) {
    return new CollectionFilterBuilder(
      this._client,
      this._documentEndpoint,
      {
        ...this._filters,
        [field]: {
          $geoIntersects: { $geometry }
        }
      }
    )
  }

  // $geoWithin?: Document;
  // $near?: Document;
  // $nearSphere?: Document;

  skip(count: number) {
    this._skip = count
    return this
  }

  limit(count: number) {
    this._limit = count
    return this
  }


  private createOperator<TValue = any, TOp extends string = string>(op: TOp) {
    return (field: string, value: TValue) => new CollectionFilterBuilder(
      this._client,
      this._documentEndpoint,
      { ...this._filters, [field]: { [op]: value } }
    )
  }

  then<TResult1 = FindResult<TDoc>, TResult2 = never>(
    onFulfilled?: ((value: FindResult<TDoc>) => (PromiseLike<TResult1> | TResult1)) | null,
    onRejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null): PromiseLike<TResult1 | TResult2> {
    const params = new URLSearchParams({
      filter: JSON.stringify(this._filters)
    })

    if (this._skip)
      params.set('skip', String(this._skip))
    if (this._limit)
      params.set('limit', String(this._limit))

    return this._client.get<FindResult<TDoc>>(`${this._documentEndpoint}?${params}`)
      .then(onFulfilled)
      .catch(onRejected)
  }
}