import { IApiClient } from "./ApiClient"
import { CollectionFilterBuilder } from "./CollectionFilterBuilder"
import {
  CreateManyResult,
  CreateResult,
  DeleteManyResult,
  FindOneResult,
  UpdateManyResult,
  UpsertResult
} from "./types"

export class CollectionQueryBuilder<TDoc extends { _id: string }> extends CollectionFilterBuilder<TDoc> {
  private static readonly _collectionsUrl = '/collections/v1'

  constructor(
    collectionName: string,
    _client: IApiClient,
  ) {
    super(_client, `${CollectionQueryBuilder._collectionsUrl}/${collectionName}/documents`, {})
  }

  public async get(id: string): Promise<FindOneResult<TDoc>> {
    return this._client.get(`${this._documentEndpoint}/${id}`)
  }

  public async findById(id: string): Promise<FindOneResult<TDoc>> {
    return this.get(id)
  }

  public async create(doc: Omit<TDoc, '_id'>): Promise<CreateResult<TDoc>> {
    return this._client.post(this._documentEndpoint, doc)
  }

  public async createMany(docs: Omit<TDoc, '_id'>[]): Promise<CreateManyResult<TDoc>> {
    return this._client.post(this._documentEndpoint, docs)
  }

  public async updateMany(docs: Partial<TDoc>[]): Promise<UpdateManyResult<TDoc>> {
    return this._client.patch(`${this._documentEndpoint}/bulk`, docs)
  }

  public async upsert(doc: Partial<TDoc>): Promise<UpsertResult<TDoc>> {
    const { _id, ...rest } = doc
    return this._client.put(`${this._documentEndpoint}/${_id}`, rest)
  }

  public async delete(id: string): Promise<{ error: any }> {
    return this._client.delete(`${this._documentEndpoint}/${id}`)
  }

  public async deleteMany(ids: string[]): Promise<DeleteManyResult<TDoc>> {
    return this._client.delete(this._documentEndpoint, ids)
  }
}
