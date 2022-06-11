import { ApiClient } from "./lib/ApiClient"
import { CollectionRootQueryBuilder } from "./lib/CollectionRootQueryBuilder"
import { RootAuthProvider } from "./lib/RootAuthProvider"
import { SessionContainer } from "./lib/SessionContainer"
import { AuthUser } from './lib/types'
import { ObjectProvider } from './lib/ObjectProvider'

export default class ViduliClient<TUser extends AuthUser = AuthUser> {
  private _endpoint = 'http://localhost:4000'
  private _session: SessionContainer
  protected apiClient: ApiClient
  public readonly auth: RootAuthProvider<TUser>

  constructor(endpoint?: string) {
    if (endpoint)
      this._endpoint = endpoint

    this._session = new SessionContainer()
    this.apiClient = new ApiClient(this._session, this._endpoint)
    this.auth = new RootAuthProvider(this.apiClient, this._session)
  }

  public collection<T extends { id: string }>(name: string): CollectionRootQueryBuilder<T> {
    return new CollectionRootQueryBuilder<T>(name, this.apiClient)
  }

  public setAuth(token: string) {
    this._session.accessToken = token
  }

  public get objects() {
    return new ObjectProvider(this.apiClient)
  }
}
