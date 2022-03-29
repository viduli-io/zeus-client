import { Filter } from "mongodb"
import { ApiClient } from "./ApiClient"
import { CollectionFilterBuilder } from "./CollectionFilterBuilder"
import {
  CreateManyResult,
  CreateResult,
  DeleteManyResult,
  FindByIdResult,
  UpdateManyResult,
  UpdateResult,
  UpsertResult
} from "../MangoClient"

export class CollectionQueryBuilder<TDoc extends { _id: string }> {
  private _client: ApiClient

  constructor(
    private collectionName: string,
    private endpoint: string,
    private token: string
  ) {
    this._client = new ApiClient(token)
  }

  private get _documentEndpoint() {
    return `${this.endpoint}/${this.collectionName}/documents`
  }

  public async findById(id: string): Promise<FindByIdResult<TDoc>> {
    return this._client.request(`${this._documentEndpoint}/${id}`)
  }

  public find(filters: Filter<TDoc>): CollectionFilterBuilder<TDoc> {
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