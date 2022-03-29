import { CollectionQueryBuilder } from "./lib/CollectionQueryBuilder"

const log = console.dir.bind(console)

export default class MangoClient {
  private _mangoEndpoint = 'http://localhost:3000'
  private _collectionsUrl = '/collections/v1'
  private _token = ''

  private get _collectionsEndpoint() {
    return this._mangoEndpoint + this._collectionsUrl
  }

  public collection<T extends { _id: string }>(name: string): CollectionQueryBuilder<T> {
    return new CollectionQueryBuilder<T>(name, this._collectionsEndpoint, this._token)
  }

  public setAuth(token: string) {
    this._token = token
  }

}

interface ResultBase {
  error: any
}

export interface FindByIdResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface CreateResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface CreateManyResult<TDoc> extends ResultBase {
  data: TDoc[]
}

export interface UpdateResult<TDoc> extends ResultBase {
  meta: { matchedCount: number, modifiedCount: number }
}

export interface UpdateManyResult<TDoc> extends UpdateResult<TDoc> {

}

export interface DeleteManyResult<TDoc> extends ResultBase {
  deletedCount: number
}

export interface UpsertResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface FindResult<TDoc> extends ResultBase {
  data: TDoc[]
}


