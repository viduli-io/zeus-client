import fetch from "isomorphic-unfetch"
import { SessionContainer } from "./SessionContainer"

export class NetworkError extends Error {

}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
}

export interface IApiClient {
  get<T>(url: string): Promise<T>

  post<T>(url: string, data: any): Promise<T>

  patch<T>(url: string, data: any): Promise<T>

  put<T>(url: string, data: any): Promise<T>

  delete<T>(url: string, data?: any): Promise<T>
}

export class ApiClient implements IApiClient {
  constructor(private session: SessionContainer, private _baseUrl: string = '') {
  }

  async request(url: string, {
    method,
    data
  }: RequestOptions = {}): Promise<any> {
    const headers: Record<string, string> = {}
    if (data)
      headers['Content-Type'] = 'application/json'
    if (this.session.accessToken)
      headers['Authorization'] = 'Bearer ' + this.session.accessToken

    try {
      const response = await fetch(this._baseUrl + url, {
        body: JSON.stringify(data) ?? undefined,
        method: method ?? 'GET',
        headers,
        credentials: 'include'
      })
      const body = await response.json()
      return body
    } catch (e: any) {
      if (e.message.includes('ECONNREFUSED')) {
        const error = new NetworkError('ECONNREFUSED')
        return { error, data: null }
      } else {
        throw e
      }
    }
  }

  async get<T>(url: string): Promise<T> {
    return this.request(url, { method: 'GET' })
  }

  async post<T>(url: string, data: any): Promise<T> {
    return this.request(url, { method: 'POST', data })
  }

  async patch<T>(url: string, data: any): Promise<T> {
    return this.request(url, { method: 'PATCH', data })
  }

  async put<T>(url: string, data: any): Promise<T> {
    return this.request(url, { method: 'PUT', data })
  }

  async delete<T>(url: string, data?: any): Promise<T> {
    return this.request(url, { method: 'DELETE', data })
  }
}
