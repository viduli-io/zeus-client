import fetch from 'isomorphic-unfetch'

const log = console.dir.bind(console)

export default class MangoClient {
  private _mangoEndpoint = 'http://localhost:3000'
  private _collectionsUrl = '/collections/v1'
  private _token = ''

  private get _collectionsEndpoint() {
    return this._mangoEndpoint + this._collectionsUrl
  }

  public collection<T extends { _id: string }>(name: string): CollectionQueryBuilder<T> {
    return new CollectionQueryBuilder<T>(name, this._collectionsEndpoint, this._token)
  }

  public setAuth(token: string) {
    this._token = token
  }

}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
}

interface ResultBase {
  error: any
}

export interface FindByIdResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface CreateResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface CreateManyResult<TDoc> extends ResultBase {
  data: TDoc[]
}

export interface UpdateResult<TDoc> extends ResultBase {
  meta: { matchedCount: number, modifiedCount: number }
}

export interface UpdateManyResult<TDoc> extends UpdateResult<TDoc> {

}

export interface DeleteManyResult<TDoc> extends ResultBase {
  deletedCount: number
}

export interface UpsertResult<TDoc> extends ResultBase {
  data: TDoc
}

class CollectionQueryBuilder<TDoc extends { _id: string }> {
  private _client: ApiClient

  constructor(
    private collectionName: string,
    private endpoint: string,
    private token: string
  ) {
    this._client = new ApiClient(token)
  }

  private get _documentEndpoint() {
    return `${this.endpoint}/${this.collectionName}/documents`
  }

  public async findById(id: string): Promise<FindByIdResult<TDoc>> {
    return this._client.request(`${this._documentEndpoint}/${id}`)
  }

  public async create(doc: Omit<TDoc, '_id'>): Promise<CreateResult<TDoc>> {
    return this._client.post(this._documentEndpoint, doc)
  }

  public async createMany(docs: Omit<TDoc, '_id'>[]): Promise<CreateManyResult<TDoc>> {
    return this._client.post(this._documentEndpoint, docs)
  }

  public async update(doc: Partial<TDoc>): Promise<UpdateResult<TDoc>> {
    const { _id, ...rest } = doc
    return this._client.patch(`${this._documentEndpoint}/${_id}`, rest)
  }

  public async updateMany(docs: Partial<TDoc>[]): Promise<UpdateManyResult<TDoc>> {
    return this._client.patch(`${this._documentEndpoint}`, docs)
  }

  public async upsert(doc: Partial<TDoc>): Promise<UpsertResult<TDoc>> {
    const { _id, ...rest } = doc
    return this._client.put(`${this._documentEndpoint}/${_id}`, doc)
  }

  public async delete(id: string): Promise<{ error: any }> {
    return this._client.delete(`${this._documentEndpoint}/${id}`)
  }

  public async deleteMany(ids: string[]): Promise<DeleteManyResult<TDoc>> {
    return this._client.delete(this._documentEndpoint, ids)
  }
}


class ApiClient {
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