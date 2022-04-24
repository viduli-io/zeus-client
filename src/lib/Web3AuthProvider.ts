import { ApiClient } from "./ApiClient"
import {
  ArrayOrObjectResult,
  AuthData,
  AuthenticationResult,
  AuthUser,
  NonceResult
} from "./types"
import { toArrayOrObject } from "./utilities"

export class Web3AuthProvider {
  constructor(private _apiClient: ApiClient) {

  }

  getNonce(walletAddress: string) {
    return this._apiClient.post<NonceResult>(`/auth/v1/web3/v1/nonce`, { walletAddress })
  }

  async authenticate<TUser extends AuthUser>(walletAddress: string, signature: string): Promise<ArrayOrObjectResult<AuthData<TUser>>> {
    return toArrayOrObject(
      await this._apiClient.post<AuthenticationResult<TUser>>(
        `/auth/v1/web3/v1/authenticate`,
        { walletAddress, signature }
      )
    )
  }
}
