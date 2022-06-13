import { ApiClient } from './lib/ApiClient'
import { CollectionRootQueryBuilder } from './lib/collections/CollectionRootQueryBuilder'
import { ObjectProvider } from './lib/objects/ObjectProvider'
import { RootAuthProvider } from './lib/auth/RootAuthProvider'
import { SessionContainer } from './lib/auth/SessionContainer'
import { AuthUser, CollectionTypeMap } from './lib/types'

export default class ViduliClient<TUser extends AuthUser = AuthUser> {
  public readonly auth: RootAuthProvider<TUser>
  protected apiClient: ApiClient
  private _endpoint = 'http://localhost:4000'
  private _session: SessionContainer

  constructor(endpoint?: string) {
    if (endpoint) this._endpoint = endpoint

    this._session = new SessionContainer()
    this.apiClient = new ApiClient(this._session, this._endpoint)
    this.auth = new RootAuthProvider(this.apiClient, this._session)
  }

  public get objects() {
    return new ObjectProvider(this.apiClient)
  }

  public collection<
    T extends { id: string },
    TCollectionId extends string = string
  >(
    name: TCollectionId
  ): CollectionRootQueryBuilder<
    TCollectionId extends keyof CollectionTypeMap
      ? CollectionTypeMap[TCollectionId]
      : T
  > {
    return new CollectionRootQueryBuilder(name, this.apiClient)
  }

  public setAuth(token: string) {
    this._session.accessToken = token
  }
}
