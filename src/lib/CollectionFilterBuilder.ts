import type { Filter, UpdateFilter } from "mongodb"
import type { IApiClient } from "./ApiClient"
import { ArrayOrObjectResult, FindOneResult, FindResult, UpdateResult } from "./types"
import { toArrayOrObject } from "./utilities"


export class CollectionFilterBuilder<TDoc extends { _id: string }> implements PromiseLike<FindResult<TDoc>> {
  protected _skip: number | undefined
  protected _limit: number | undefined

  constructor(
    protected _client: IApiClient,
    protected _documentEndpoint: string,
    protected _filters: Filter<TDoc>
  ) {
  }

  public async distinct<T = any>(key: string): Promise<ArrayOrObjectResult<T[]>> {
    return toArrayOrObject(
      await this._client.get(`${this._documentEndpoint}/distinct?key=${key}`)
    )
  }

  public async findOne(filters: Filter<TDoc> = {}): Promise<FindOneResult<TDoc>> {
    const { error, data } = await this.find(filters)
    return { error, data: data[0] }
  }

  public find(filters: Filter<TDoc> = {}): Promise<FindResult<TDoc>> {
    this._filters = { ...this._filters, ...filters }
    const params = this.getParams()

    return this._client.get<FindResult<TDoc>>(`${this._documentEndpoint}?${params}`)
  }

  public async update(doc: UpdateFilter<TDoc>): Promise<UpdateResult<TDoc>>
  public async update(filter: Filter<TDoc>, doc: UpdateFilter<TDoc>): Promise<UpdateResult<TDoc>>
  public async update(filterOrDoc: Filter<TDoc> | UpdateFilter<TDoc>, doc?: UpdateFilter<TDoc>): Promise<UpdateResult<TDoc>> {
    if (doc) {
      this._filters = { ...this._filters, ...filterOrDoc }
      const params = this.getParams()

      return this._client.patch(`${this._documentEndpoint}?${params}`, doc)
    } else {
      if (Object.entries(this._filters).length > 0) {
        const params = this.getParams()
        return this._client.patch(`${this._documentEndpoint}?${params}`, filterOrDoc)
      }

      const { _id, ...rest } = filterOrDoc
      return this._client.patch(`${this._documentEndpoint}/${_id}`, rest)
    }
  }

  public eq = this.createOperator('$eq')

  public ne = this.createOperator('$ne')

  public gt = this.createOperator('$gt')

  public gte = this.createOperator('$gte')

  public lt = this.createOperator('$lt')

  public lte = this.createOperator('$lte')

  public in = this.createOperator<any[]>('$in')

  public nin = this.createOperator<any[]>('$nin')

  // TODO: implement this
  // not(action: (builder: CollectionFilterBuilder<TDoc>) => void) {
  //   action(this)
  //
  //   this._filters = { ...this._filters, }
  // }

  public exists = this.createOperator<boolean>('$exists')

  public mod = this.createOperator<[ number, number ]>('$mod')

  public regex = this.createOperator('$regex')

  public geoIntersects(field: string, $geometry: any) {
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

  public skip(count: number) {
    this._skip = count
    return this
  }

  public limit(count: number) {
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

  protected getParams() {
    const params = new URLSearchParams({
      filter: JSON.stringify(this._filters)
    })

    if (this._skip)
      params.set('skip', String(this._skip))
    if (this._limit)
      params.set('limit', String(this._limit))

    return params
  }

  then<TResult1 = FindResult<TDoc>, TResult2 = never>(
    onFulfilled?: ((value: FindResult<TDoc>) => (PromiseLike<TResult1> | TResult1)) | null,
    onRejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null): PromiseLike<TResult1 | TResult2> {
    const params = this.getParams()

    return this._client.get<FindResult<TDoc>>(`${this._documentEndpoint}?${params}`)
      .then(onFulfilled)
      .catch(onRejected)
  }
}
