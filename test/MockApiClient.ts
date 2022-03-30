import { IApiClient, RequestOptions } from "../src/lib/ApiClient"

export class MockApiClient implements IApiClient {
  callState: Record<string, any[]> = {}

  delete<T>(url: string, data?: any): Promise<T> {
    return Promise.resolve({} as T)
  }

  patch<T>(url: string, data: any): Promise<T> {
    return Promise.resolve({} as T)
  }

  post<T>(url: string, data: any): Promise<T> {
    return Promise.resolve({} as T)
  }

  put<T>(url: string, data: any): Promise<T> {
    return Promise.resolve({} as T)
  }

  request(url: string, opts?: RequestOptions): Promise<any> {
    return Promise.resolve(undefined)
  }

  get<T>(url: string): Promise<T> {
    this.callState['get'] = [ url ]
    return Promise.resolve({} as T)
  }

}