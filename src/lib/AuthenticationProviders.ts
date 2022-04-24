import { ApiClient } from "./ApiClient"
import { SessionContainer } from "./SessionContainer"
import {
  AccessTokenResult,
  ArrayOrObjectResult,
  AuthUser,
  FindOneResult,
  ResultBase
} from "./types"
import { toArrayOrObject } from "./utilities"
import { Web3AuthProvider } from "./Web3AuthProvider"

export class AuthenticationProviders {
  constructor(private _apiClient: ApiClient, private _session: SessionContainer) {

  }

  web3 = new Web3AuthProvider(this._apiClient)

  public async getAccessToken() {
    const result = await this._apiClient.post<AccessTokenResult>(`/auth/v1/token/access`, {})
    if (result.data?.accessToken) {
      this._session.accessToken = result.data.accessToken
    }
    return result
  }

  public async getUser<TUser extends AuthUser>(): Promise<ArrayOrObjectResult<AuthUser>> {
    const result = await this._apiClient.get<FindOneResult<AuthUser>>(`/auth/v1/user`)
    return toArrayOrObject(result)
  }

  public async logout(): Promise<ArrayOrObjectResult<never>> {
    const result = await this._apiClient.delete<ResultBase>(`/auth/v1/session`)
    return toArrayOrObject(result)
  }
}
