import { ApiClient } from "./lib/ApiClient"
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
    return new CollectionQueryBuilder<T>(name, this._collectionsEndpoint, new ApiClient(this._token))
  }

  public setAuth(token: string) {
    this._token = token
  }

}