import { Web3AuthProvider } from "./Web3AuthProvider"

export class AuthenticationProviders {
  constructor(private _endpoint: string) {
  }

  web3 = new Web3AuthProvider(this._endpoint)
}