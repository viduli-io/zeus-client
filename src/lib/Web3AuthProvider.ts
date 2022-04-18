import { ApiClient } from "./ApiClient"
import { AuthenticationResult, AuthUser, NonceResult } from "./types"

export class Web3AuthProvider {
  constructor(private _apiClient: ApiClient) {

  }

  getNonce(walletAddress: string) {
    return this._apiClient.post<NonceResult>(`/auth/v1/web3/v1/nonce`, { walletAddress })
  }

  authenticate<TUser extends AuthUser>(walletAddress: string, signature: string) {
    return this._apiClient.post<AuthenticationResult<TUser>>(
      `/auth/v1/web3/v1/authenticate`,
      { walletAddress, signature }
    )
  }
}
