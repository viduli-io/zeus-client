import { ApiClient } from "./lib/ApiClient"
import { AuthenticationProviders } from "./lib/AuthenticationProviders"
import { CollectionQueryBuilder } from "./lib/CollectionQueryBuilder"

export default class ViduliClient {
  private _endpoint = 'http://localhost:3000'
  private _collectionsUrl = '/collections/v1'
  private _token = ''
  public readonly auth

  constructor(
    endpoint?: string
  ) {
    if (endpoint)
      this._endpoint = endpoint

    this.auth = new AuthenticationProviders(this._endpoint)
  }

  private get _collectionsEndpoint() {
    return this._endpoint + this._collectionsUrl
  }

  public collection<T extends { _id: string }>(name: string): CollectionQueryBuilder<T> {
    return new CollectionQueryBuilder<T>(name, this._collectionsEndpoint, new ApiClient(this._token))
  }

  public setAuth(token: string) {
    this._token = token
  }

}
