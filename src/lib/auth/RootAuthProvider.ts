import { ApiClient } from '../ApiClient'
import { SessionContainer } from './SessionContainer'
import {
  AccessTokenResult,
  ArrayOrObjectResult,
  AuthenticationResult,
  AuthUser,
  FindOneResult,
  ResultBase,
} from '../types'
import { toArrayOrObject } from '../util'
import { Web3AuthProvider } from './Web3AuthProvider'

export class RootAuthProvider<TUser extends AuthUser = AuthUser> {
  constructor(
    private _apiClient: ApiClient,
    private _session: SessionContainer
  ) {}

  web3 = new Web3AuthProvider(this._apiClient, this._session)

  public async passwordSignIn(
    email: string,
    password: string
  ): Promise<AuthenticationResult<TUser>> {
    const result = await this._apiClient.post(`/auth/v1/sign-in/password`, {
      email,
      password,
    })
    return toArrayOrObject(result)
  }

  public async passwordSignUp(
    email: string,
    password: string
  ): Promise<ArrayOrObjectResult<AuthUser>> {
    const result = await this._apiClient.post(`/auth/v1/sign-up/password`, {
      email,
      password,
    })
    return toArrayOrObject(result)
  }

  public async getAccessToken() {
    const result = await this._apiClient.post<AccessTokenResult>(
      `/auth/v1/token/access`,
      {}
    )
    if (result.data?.accessToken) {
      this._session.accessToken = result.data.accessToken
    }
    return result
  }

  public async getUser(): Promise<ArrayOrObjectResult<TUser>> {
    const result = await this._apiClient.get<FindOneResult<AuthUser>>(
      `/auth/v1/user`
    )
    return toArrayOrObject(result)
  }

  public async logout(): Promise<ArrayOrObjectResult<never>> {
    const result = await this._apiClient.delete<ResultBase>(`/auth/v1/session`)
    this._session.clear()
    return toArrayOrObject(result)
  }
}
