export type { Filter, UpdateFilter } from "mongodb"

export interface ResultBase {
  error: any
}

export interface CreateResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface CreateManyResult<TDoc> extends ResultBase {
  data: TDoc[]
}

export interface UpdateResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface UpdateManyResult<TDoc> extends ResultBase {
  data: TDoc[]
}

export interface DeleteManyResult<TDoc> extends ResultBase {
  deletedCount: number
}

export interface UpsertResult<TDoc> extends ResultBase {
  data: TDoc
}

export interface FindResult<TDoc> extends ResultBase {
  data: TDoc[]
}

export interface FindOneResult<TDoc> extends ResultBase {
  data: TDoc
}


export interface NonceResult extends ResultBase {
  data: { nonce: string }
}

export interface AuthUser {
  _id: string
  walletAddress?: string
}

export interface AuthData<T extends AuthUser> {
  accessToken: string,
  user: T
}

export interface AuthenticationResult<T extends AuthUser> extends ResultBase {
  data: { accessToken: string, user: T }
}

export interface AccessTokenResult extends ResultBase {
  data: { accessToken: string }
}

export type ArrayOrObjectResult<T> =
  ([ Error, null ] | [ null, T ])
  & { error: Error, data: T }
