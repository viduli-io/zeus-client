import { ApiClient } from './ApiClient'
import { ArrayOrObjectResult } from './types'
import { toArrayOrObject } from './util'

export interface ImageOptions {}

export interface ObjectDoc {
  id: string
  type: 'image' | 'file'
  bucket: string
  prefix: string
  url: string
}

export class ObjectProvider {
  constructor(private _apiClient: ApiClient) {}

  public async uploadImage(
    file: File,
    options: ImageOptions = {}
  ): Promise<ArrayOrObjectResult<ObjectDoc>> {
    const fd = new FormData()
    fd.set('file', file)

    return toArrayOrObject(await this._apiClient.post(`/objects/v1/image`, fd))
  }
}
