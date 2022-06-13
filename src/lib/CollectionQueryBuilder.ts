import type { IApiClient } from './ApiClient'
import { CollectionFilterBuilder } from './CollectionFilterBuilder'
import { Sort } from './mongodb-types'
import {
  ArrayOrObjectResult,
  Filter,
  FindOneResult,
  FindOptions,
  FindResult,
  Projection,
  UpdateFilter,
  UpdateResult,
} from './types'
import { toArrayOrObject } from './utilities'

export class CollectionQueryBuilder<
  TDoc extends { id: string }
> extends CollectionFilterBuilder<TDoc> {
  protected _skip: number | undefined
  protected _limit: number | undefined
  protected _project: Projection | undefined
  protected _sort: Sort | undefined

  constructor(
    _client: IApiClient,
    _documentEndpoint: string,
    _filters: Filter<TDoc>
  ) {
    super(_client, _documentEndpoint, _filters as any)
  }

  public async distinct<T = any>(
    key: string
  ): Promise<ArrayOrObjectResult<T[]>> {
    return toArrayOrObject(
      await this._client.get(`${this._documentEndpoint}/distinct?key=${key}`)
    )
  }

  public async findOne(
    filters: Filter<TDoc> = {}
  ): Promise<FindOneResult<TDoc | null>> {
    const { error, data } = await this.find(filters, { limit: 2 })
    return { error, data: error ? null : data[0] }
  }

  public find(
    filters: Filter<TDoc> = {},
    options: FindOptions<TDoc> = {}
  ): Promise<FindResult<TDoc>> {
    this._filters = { ...this._filters, ...filters }
    this._skip = options.skip ?? this._skip
    this._limit = options.limit ?? this._limit
    this._project = options.project ?? this._project
    this._sort = options.sort ?? this._sort

    const params = this.getParams()

    return this._client.get<FindResult<TDoc>>(
      `${this._documentEndpoint}?${params}`
    )
  }

  public async update(doc: UpdateFilter<TDoc>): Promise<UpdateResult<TDoc>>
  public async update(
    filter: Filter<TDoc>,
    doc: UpdateFilter<TDoc>
  ): Promise<UpdateResult<TDoc>>
  public async update(
    filterOrDoc: Filter<TDoc> | UpdateFilter<TDoc>,
    doc?: UpdateFilter<TDoc>
  ): Promise<UpdateResult<TDoc>> {
    if (doc) {
      this._filters = { ...this._filters, ...filterOrDoc }
      const params = this.getParams()

      return this._client.patch(`${this._documentEndpoint}?${params}`, doc)
    } else {
      if (Object.entries(this._filters).length > 0) {
        const params = this.getParams()
        return this._client.patch(
          `${this._documentEndpoint}?${params}`,
          filterOrDoc
        )
      }

      const { id, ...rest } = filterOrDoc
      return this._client.patch(`${this._documentEndpoint}/${id}`, rest)
    }
  }

  // $geoWithin?: Document;
  // $near?: Document;
  // $nearSphere?: Document;

  or(
    action: (
      builder: CollectionFilterBuilder<TDoc>
    ) => CollectionFilterBuilder<TDoc>
  ) {
    const result = action(
      new CollectionFilterBuilder<TDoc>(
        this._client,
        this._documentEndpoint,
        {}
      )
    )

    const filters = this._filters

    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      $or: [
        ...(Object.keys(filters).length > 0 ? [filters] : []),
        result.filters,
      ],
    })
  }

  and(
    action: (
      builder: CollectionFilterBuilder<TDoc>
    ) => CollectionFilterBuilder<TDoc>
  ) {
    const result = action(
      new CollectionFilterBuilder<TDoc>(
        this._client,
        this._documentEndpoint,
        {}
      )
    )

    const filters = this._filters

    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      $and: [
        ...(Object.keys(filters).length > 0 ? [filters] : []),
        result.filters,
      ],
    })
  }

  public skip(count: number) {
    this._skip = count
    return this
  }

  public limit(count: number) {
    this._limit = count
    return this
  }

  protected getParams() {
    const params = new URLSearchParams({
      filter: JSON.stringify(this._filters),
    })

    if (this._skip) params.set('skip', String(this._skip))
    if (this._limit) params.set('limit', String(this._limit))

    return params
  }
}
