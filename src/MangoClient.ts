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

interface BaseResult {
  error: any
}

interface FindByIdResult<TDoc> extends BaseResult {
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

  public async findById<TDoc>(id: string): Promise<FindByIdResult<TDoc>> {
    return this._client.request(`${this._documentEndpoint}/${id}`)
  }

  public async create(doc: Omit<TDoc, '_id'>): Promise<{ error: any, data: TDoc }> {
    return this._client.post(this._documentEndpoint, doc)
  }

  public async createMany(docs: Omit<TDoc, '_id'>[]): Promise<{ error: any, data: TDoc[] }> {
    return this._client.post(this._documentEndpoint, docs)
  }

  public async update(doc: Partial<TDoc>): Promise<{ error: any, meta: { matched: number, modified: number } }> {
    const { _id, ...rest } = doc
    return this._client.patch(`${this._documentEndpoint}/${_id}`, rest)
  }

  public async updateMany(docs: Partial<TDoc>[]): Promise<{ error: any, meta: { matched: number, modified: number } }> {
    return this._client.patch(`${this._documentEndpoint}`, docs)
  }

  public async delete(id: string): Promise<{ error: any }> {
    return this._client.delete(`${this._documentEndpoint}/${id}`)
  }

  public async deleteMany(ids: string[]): Promise<{ error: any }> {
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

  public async post<TData>(url: string, data: any): Promise<{ error: null, data: TData }> {
    return this.request(url, { method: 'POST', data })
  }

  public async patch<TData>(url: string, data: any): Promise<{ error: null, meta: { matched: number, modified: number } }> {
    return this.request(url, { method: 'PATCH', data })
  }

  public async delete(url: string, data?: any): Promise<{ error: null }> {
    return this.request(url, { method: 'DELETE', data })
  }
}