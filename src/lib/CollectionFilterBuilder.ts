import { Filter } from "mongodb"
import { ApiClient } from "./ApiClient"
import { FindResult } from "../MangoClient"

export class CollectionFilterBuilder<TDoc> implements PromiseLike<FindResult<TDoc>> {
  constructor(
    private _client: ApiClient,
    private _documentEndpoint: string,
    private _filters: Filter<TDoc>
  ) {
  }

  eq(field: string, value: any) {
    return new CollectionFilterBuilder(
      this._client,
      this._documentEndpoint,
      { ...this._filters, [field]: { $eq: value } }
    )
  }


  then<TResult1 = FindResult<TDoc>, TResult2 = never>(
    onFulfilled?: ((value: FindResult<TDoc>) => (PromiseLike<TResult1> | TResult1)) | null,
    onRejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null): PromiseLike<TResult1 | TResult2> {
    return this._client.request(this._documentEndpoint)
  }

}