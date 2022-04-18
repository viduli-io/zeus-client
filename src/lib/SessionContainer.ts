import jwtDecode, { JwtPayload } from "jwt-decode"

export class SessionContainer {

  refreshToken: string | null = null

  accessToken: string | null = null

  get payload() {
    return this.accessToken ? jwtDecode<JwtPayload>(this.accessToken) : null
  }

  get exp() {
    const payload = this.payload
    return payload ? payload.exp : null
  }
}
