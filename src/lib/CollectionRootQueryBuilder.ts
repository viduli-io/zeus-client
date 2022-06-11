import { IApiClient } from './ApiClient'
import { CollectionQueryBuilder } from './CollectionQueryBuilder'
import {
  CreateManyResult,
  CreateResult,
  DeleteManyResult,
  Filter,
  FindOneResult,
  UpdateManyResult,
  UpsertResult,
} from './types'

export class CollectionRootQueryBuilder<
  TDoc extends { id: string }
> extends CollectionQueryBuilder<TDoc> {
  private static readonly _collectionsUrl = '/collections/v1'

  constructor(collectionName: string, _client: IApiClient) {
    super(
      _client,
      `${CollectionRootQueryBuilder._collectionsUrl}/${collectionName}/documents`,
      {}
    )
  }

  public async get(id: string): Promise<FindOneResult<TDoc>> {
    return this._client.get(`${this._documentEndpoint}/${id}`)
  }

  public async findById(id: string): Promise<FindOneResult<TDoc>> {
    return this.get(id)
  }

  public async create(doc: Omit<TDoc, 'id'>): Promise<CreateResult<TDoc>> {
    return this._client.post(this._documentEndpoint, doc)
  }

  public async createMany(
    docs: Omit<TDoc, 'id'>[]
  ): Promise<CreateManyResult<TDoc>> {
    return this._client.post(`${this._documentEndpoint}/bulk`, docs)
  }

  public async updateMany(
    docs: Partial<TDoc>[]
  ): Promise<UpdateManyResult<TDoc>> {
    return this._client.patch(`${this._documentEndpoint}/bulk`, docs)
  }

  public async upsert(doc: Partial<TDoc>): Promise<UpsertResult<TDoc>> {
    const { id, ...rest } = doc
    return this._client.put(`${this._documentEndpoint}/${id}`, rest)
  }

  public async delete(id: string): Promise<{ error: any }> {
    return this._client.delete(`${this._documentEndpoint}/${id}`)
  }

  public async deleteMany(
    ids: string[] | Filter<TDoc>
  ): Promise<DeleteManyResult<TDoc>> {
    return this._client.delete(this._documentEndpoint, ids)
  }
}
