import { IApiClient } from '../ApiClient'
import { CollectionQueryBuilder } from './CollectionQueryBuilder'
import { Filter, PropertyType } from '../mongodb-types'
import { NestedKey } from '../types'

export class CollectionFilterBuilder<TDoc extends { id: string }> {
  constructor(
    protected _client: IApiClient,
    protected _documentEndpoint: string,
    protected _filters: Filter<TDoc>
  ) {}

  get filters() {
    return this._filters
  }

  public eq<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $eq: value },
    })
  }

  public ne<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $ne: value },
    })
  }

  public gt<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $gt: value },
    })
  }

  public gte<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $gte: value },
    })
  }

  public lt<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $lt: value },
    })
  }

  public lte<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $lte: value },
    })
  }

  public in<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $in: value },
    })
  }

  public nin<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $nin: value },
    })
  }

  public exists<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $exists: value },
    })
  }

  public mod<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $mod: value },
    })
  }

  public regex<Key extends NestedKey<TDoc>>(
    field: Key,
    value: PropertyType<TDoc, Key>
  ) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: { $regex: value },
    })
  }

  public geoIntersects(field: string, $geometry: any) {
    return new CollectionQueryBuilder(this._client, this._documentEndpoint, {
      ...this._filters,
      [field]: {
        $geoIntersects: { $geometry },
      },
    })
  }
}
