import type { Filter } from "mongodb"
import { IApiClient } from "./ApiClient"
import { CollectionFilterBuilder } from "./CollectionFilterBuilder"
import {
  CreateManyResult,
  CreateResult,
  DeleteManyResult,
  FindByIdResult,
  UpdateManyResult,
  UpdateResult,
  UpsertResult
} from "./types"

export class CollectionQueryBuilder<TDoc extends { _id: string }> {

  constructor(
    private collectionName: string,
    private endpoint: string,
    private readonly _client: IApiClient,
  ) {
  }

  private get _documentEndpoint() {
    return `${this.endpoint}/${this.collectionName}/documents`
  }

  public async findById(id: string): Promise<FindByIdResult<TDoc>> {
    return this._client.get(`${this._documentEndpoint}/${id}`)
  }

  public find(filters: Filter<TDoc> = {}): CollectionFilterBuilder<TDoc> {
    return new CollectionFilterBuilder(this._client, this._documentEndpoint, filters)
  }

  public async create(doc: Omit<TDoc, '_id'>): Promise<CreateResult<TDoc>> {
    return this._client.post(this._documentEndpoint, doc)
  }

  public async createMany(docs: Omit<TDoc, '_id'>[]): Promise<CreateManyResult<TDoc>> {
    return this._client.post(this._documentEndpoint, docs)
  }

  public async update(doc: Partial<TDoc>): Promise<UpdateResult<TDoc>> {
    const { _id, ...rest } = doc
    return this._client.patch(`${this._documentEndpoint}/${_id}`, rest)
  }

  public async updateMany(docs: Partial<TDoc>[]): Promise<UpdateManyResult<TDoc>> {
    return this._client.patch(`${this._documentEndpoint}`, docs)
  }

  public async upsert(doc: Partial<TDoc>): Promise<UpsertResult<TDoc>> {
    const { _id, ...rest } = doc
    return this._client.put(`${this._documentEndpoint}/${_id}`, doc)
  }

  public async delete(id: string): Promise<{ error: any }> {
    return this._client.delete(`${this._documentEndpoint}/${id}`)
  }

  public async deleteMany(ids: string[]): Promise<DeleteManyResult<TDoc>> {
    return this._client.delete(this._documentEndpoint, ids)
  }
}