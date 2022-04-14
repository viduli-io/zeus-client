import { ApiClient } from "./ApiClient"
import { AuthenticationResult, AuthUser, NonceResult } from "./types"

export class Web3AuthProvider {
  constructor(private _endpoint: string) {

  }

  apiClient = new ApiClient()

  getNonce(walletAddress: string) {
    return this.apiClient.post<NonceResult>(
      this._endpoint + `/auth/v1/web3/v1/nonce`,
      { walletAddress }
    )
  }

  authenticate<TUser extends AuthUser>(walletAddress: string, signature: string) {
    return this.apiClient.post<AuthenticationResult<TUser>>(
      this._endpoint + `/auth/v1/web3/v1/authenticate`,
      { walletAddress, signature }
    )
  }
}
