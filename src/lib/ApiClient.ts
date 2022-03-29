import fetch from "isomorphic-unfetch"

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
}

export class ApiClient {
  constructor(private token: string) {
  }

  public async request(url: string, {
    method,
    data
  }: RequestOptions = {}): Promise<any> {
    const response = await fetch(url, {
      body: JSON.stringify(data) ?? undefined,
      method: method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
      }
    })
    const body = await response.json()
    return body
  }

  public async post<T>(url: string, data: any): Promise<T> {
    return this.request(url, { method: 'POST', data })
  }

  public async patch<T>(url: string, data: any): Promise<T> {
    return this.request(url, { method: 'PATCH', data })
  }

  public async put<T>(url: string, data: any): Promise<T> {
    return this.request(url, { method: 'PUT', data })
  }

  public async delete<T>(url: string, data?: any): Promise<T> {
    return this.request(url, { method: 'DELETE', data })
  }
}