import { ApiClient } from "./ApiClient"
import { SessionContainer } from './SessionContainer'
import {
  ArrayOrObjectResult,
  AuthData,
  AuthenticationResult,
  AuthUser,
  NonceResult
} from "./types"
import { toArrayOrObject } from "./utilities"

export class Web3AuthProvider {
  constructor(private _apiClient: ApiClient, private _session: SessionContainer) {

  }

  getNonce(walletAddress: string) {
    return this._apiClient.post<NonceResult>(`/auth/v1/web3/v1/nonce`, { walletAddress })
  }

  async authenticate<TUser extends AuthUser>(walletAddress: string, signature: string): Promise<ArrayOrObjectResult<AuthData<TUser>>> {
    const result = await this._apiClient.post<AuthenticationResult<TUser>>(
      `/auth/v1/web3/v1/authenticate`,
      { walletAddress, signature }
    )
    if (result.data?.accessToken) {
      this._session.accessToken = result.data.accessToken
    }

    return toArrayOrObject(result)
  }
}
