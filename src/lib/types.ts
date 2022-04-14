
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

export interface FindResult<TDoc> extends ResultBase {
  data: TDoc[]
}

export interface NonceResult extends ResultBase {
  data: { nonce: string }
}

export interface AuthUser {
  _id: string
}

export interface AuthenticationResult<T extends AuthUser> extends ResultBase {
  data: { accessToken: string, user: T }
}
