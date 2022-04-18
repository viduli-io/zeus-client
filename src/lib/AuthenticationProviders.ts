import { ApiClient } from "./ApiClient"
import { SessionContainer } from "./SessionContainer"
import { AccessTokenResult, ArrayOrObjectResult, AuthUser, FindOneResult } from "./types"
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

  public async getUser(): Promise<ArrayOrObjectResult<AuthUser>> {
    const result = await this._apiClient.get<FindOneResult<AuthUser>>(`/auth/v1/user`)
    const resultArray: [ Error, null ] | [ null, AuthUser ] = [ result.error, result.data ]
    return Object.assign(resultArray, result)
  }
}
