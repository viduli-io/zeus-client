import { IApiClient, RequestOptions } from "../src/lib/ApiClient"

export class MockApiClient implements IApiClient {
  callStack: any[][] = []

  delete<T>(url: string, data?: any): Promise<T> {
    this.callStack.push([ 'delete', url, data ])
    return Promise.resolve({} as T)
  }

  patch<T>(url: string, data: any): Promise<T> {
    this.callStack.push([ 'patch', url, data ])
    return Promise.resolve({} as T)
  }

  post<T>(url: string, data: any): Promise<T> {
    this.callStack.push([ 'post', url, data ])
    return Promise.resolve({} as T)
  }

  put<T>(url: string, data: any): Promise<T> {
    this.callStack.push([ 'put', url, data ])
    return Promise.resolve({} as T)
  }

  request(url: string, opts?: RequestOptions): Promise<any> {
    this.callStack.push([ url, opts ])
    return Promise.resolve(undefined)
  }

  get<T>(url: string): Promise<T> {
    this.callStack.push(['get', url ])
    return Promise.resolve({} as T)
  }

}
