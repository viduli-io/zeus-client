import type { BSONRegExp, Document } from 'bson'
import {
  Binary,
  Decimal128,
  Double,
  Int32,
  Long,
  ObjectId,
  ObjectIdLike,
  Timestamp,
} from 'bson'

export type AcceptedFields<TSchema, FieldType, AssignableType> = {
  readonly [key in KeysOfAType<TSchema, FieldType>]?: AssignableType
}

export type IsAny<Type, ResultIfAny, ResultIfNotAny> = true extends false & Type
  ? ResultIfAny
  : ResultIfNotAny

export type KeysOfOtherType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? never : key
}[keyof TSchema]

export type MatchKeysAndValues<TSchema> = Readonly<Partial<TSchema>> &
  Record<string, any>

export type NumericType = IntegerType | Decimal128 | Double

export type OnlyFieldsOfType<
  TSchema,
  FieldType = any,
  AssignableType = FieldType
> = IsAny<
  TSchema[keyof TSchema],
  Record<string, FieldType>,
  AcceptedFields<TSchema, FieldType, AssignableType> &
    NotAcceptedFields<TSchema, FieldType> &
    Record<string, AssignableType>
>

export type SortDirection = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'

export type Sort =
  | string
  | Exclude<
      SortDirection,
      {
        $meta: string
      }
    >
  | string[]
  | {
      [key: string]: SortDirection
    }
  | Map<string, SortDirection>
  | [string, SortDirection][]
  | [string, SortDirection]

export type NotAcceptedFields<TSchema, FieldType> = {
  readonly [key in KeysOfOtherType<TSchema, FieldType>]?: never
}

export type KeysOfAType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? key : never
}[keyof TSchema]

export type AddToSetOperators<Type> = {
  $each?: Array<Flatten<Type>>
}

export type FilterOperations<T> = T extends Record<string, any>
  ? {
      [key in keyof T]?: FilterOperators<T[key]>
    }
  : FilterOperators<T>

export type ArrayOperator<Type> = {
  $each?: Array<Flatten<Type>>
  $slice?: number
  $position?: number
  $sort?: Sort
}

export type Flatten<Type> = Type extends ReadonlyArray<infer Item> ? Item : Type

export type IntegerType = number | Int32 | Long

export type OptionalId<TSchema> = EnhancedOmit<TSchema, 'id'> & {
  id?: InferIdType<TSchema>
}

export type PullAllOperator<TSchema> = ({
  readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?: TSchema[key]
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
  readonly [key: string]: ReadonlyArray<any>
}

export type PullOperator<TSchema> = ({
  readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?:
    | Partial<Flatten<TSchema[key]>>
    | FilterOperations<Flatten<TSchema[key]>>
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
  readonly [key: string]: FilterOperators<any> | any
}

export type PushOperator<TSchema> = ({
  readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?:
    | Flatten<TSchema[key]>
    | ArrayOperator<Array<Flatten<TSchema[key]>>>
} & NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
  readonly [key: string]: ArrayOperator<any> | any
}

export type SetFields<TSchema> = ({
  readonly [key in KeysOfAType<TSchema, ReadonlyArray<any> | undefined>]?:
    | OptionalId<Flatten<TSchema[key]>>
    | AddToSetOperators<Array<OptionalId<Flatten<TSchema[key]>>>>
} & NotAcceptedFields<TSchema, ReadonlyArray<any> | undefined>) & {
  readonly [key: string]: AddToSetOperators<any> | any
}

export type UpdateFilter<TSchema> = {
  $currentDate?: OnlyFieldsOfType<
    TSchema,
    Date | Timestamp,
    | true
    | {
        $type: 'date' | 'timestamp'
      }
  >
  $inc?: OnlyFieldsOfType<TSchema, NumericType | undefined>
  $min?: MatchKeysAndValues<TSchema>
  $max?: MatchKeysAndValues<TSchema>
  $mul?: OnlyFieldsOfType<TSchema, NumericType | undefined>
  $rename?: Record<string, string>
  $set?: MatchKeysAndValues<TSchema>
  $setOnInsert?: MatchKeysAndValues<TSchema>
  $unset?: OnlyFieldsOfType<TSchema, any, '' | true | 1>
  $addToSet?: SetFields<TSchema>
  $pop?: OnlyFieldsOfType<TSchema, ReadonlyArray<any>, 1 | -1>
  $pull?: PullOperator<TSchema>
  $push?: PushOperator<TSchema>
  $pullAll?: PullAllOperator<TSchema>
  $bit?: OnlyFieldsOfType<
    TSchema,
    NumericType | undefined,
    | {
        and: IntegerType
      }
    | {
        or: IntegerType
      }
    | {
        xor: IntegerType
      }
  >
} & Document

export type BitwiseFilter =
  | number /** numeric bit mask */
  | Binary /** BinData bit mask */
  | ReadonlyArray<number>

export const BSONType = Object.freeze({
  double: 1,
  string: 2,
  object: 3,
  array: 4,
  binData: 5,
  undefined: 6,
  objectId: 7,
  bool: 8,
  date: 9,
  null: 10,
  regex: 11,
  dbPointer: 12,
  javascript: 13,
  symbol: 14,
  javascriptWithScope: 15,
  int: 16,
  timestamp: 17,
  long: 18,
  decimal: 19,
  minKey: -1,
  maxKey: 127,
})

export type BSONType = typeof BSONType[keyof typeof BSONType]

export type BSONTypeAlias = keyof typeof BSONType

export type EnhancedOmit<TRecordOrUnion, KeyUnion> =
  string extends keyof TRecordOrUnion
    ? TRecordOrUnion
    : TRecordOrUnion extends any
    ? Pick<TRecordOrUnion, Exclude<keyof TRecordOrUnion, KeyUnion>>
    : never

export type NonObjectIdLikeDocument = {
  [key in keyof ObjectIdLike]?: never
} & Document

export interface FilterOperators<TValue> extends NonObjectIdLikeDocument {
  $eq?: TValue
  $gt?: TValue
  $gte?: TValue
  $in?: ReadonlyArray<TValue>
  $lt?: TValue
  $lte?: TValue
  $ne?: TValue
  $nin?: ReadonlyArray<TValue>
  $not?: TValue extends string
    ? FilterOperators<TValue> | RegExp
    : FilterOperators<TValue>
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean
  $type?: BSONType | BSONTypeAlias
  $expr?: Record<string, any>
  $jsonSchema?: Record<string, any>
  $mod?: TValue extends number ? [number, number] : never
  $regex?: TValue extends string ? RegExp | BSONRegExp | string : never
  $options?: TValue extends string ? string : never
  $geoIntersects?: {
    $geometry: Document
  }
  $geoWithin?: Document
  $near?: Document
  $nearSphere?: Document
  $maxDistance?: number
  $all?: ReadonlyArray<any>
  $elemMatch?: Document
  $size?: TValue extends ReadonlyArray<any> ? number : never
  $bitsAllClear?: BitwiseFilter
  $bitsAllSet?: BitwiseFilter
  $bitsAnyClear?: BitwiseFilter
  $bitsAnySet?: BitwiseFilter
  $rand?: Record<string, never>
}

export type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string

export type NestedPaths<Type> = Type extends
  | string
  | number
  | boolean
  | Date
  | RegExp
  | Buffer
  | Uint8Array
  | ((...args: any[]) => any)
  | { _bsontype: string }
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? [number, ...NestedPaths<ArrayType>]
  : Type extends Map<string, any>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]: Type[Key] extends Type
        ? [Key]
        : Type extends Type[Key]
        ? [Key]
        : Type[Key] extends ReadonlyArray<infer ArrayType>
        ? Type extends ArrayType
          ? [Key]
          : ArrayType extends Type
          ? [Key]
          : [Key, ...NestedPaths<Type[Key]>]
        : [Key, ...NestedPaths<Type[Key]>]
    }[Extract<keyof Type, string>]
  : []

export type PropertyType<
  Type,
  Property extends string
> = string extends Property
  ? unknown
  : Property extends keyof Type
  ? Type[Property]
  : Property extends `${number}`
  ? Type extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : unknown
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends `${number}`
    ? Type extends ReadonlyArray<infer ArrayType>
      ? PropertyType<ArrayType, Rest>
      : unknown
    : Key extends keyof Type
    ? Type[Key] extends Map<string, infer MapType>
      ? MapType
      : PropertyType<Type[Key], Rest>
    : unknown
  : unknown

export type InferIdType<TSchema> = TSchema extends { id: infer IdType }
  ? Record<any, never> extends IdType
    ? never
    : IdType
  : TSchema extends { id?: infer IdType }
  ? unknown extends IdType
    ? ObjectId
    : IdType
  : ObjectId

export type WithId<TSchema> = EnhancedOmit<TSchema, 'id'> & {
  id: InferIdType<TSchema>
}

export interface RootFilterOperators<TSchema> extends Document {
  $and?: Filter<TSchema>[]
  $nor?: Filter<TSchema>[]
  $or?: Filter<TSchema>[]
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
  $where?: string | ((this: TSchema) => boolean)
  $comment?: string | Document
}

export type RegExpOrString<T> = T extends string ? BSONRegExp | RegExp | T : T

export type AlternativeType<T> = T extends ReadonlyArray<infer U>
  ? T | RegExpOrString<U>
  : RegExpOrString<T>

export type Condition<T> =
  | AlternativeType<T>
  | FilterOperators<AlternativeType<T>>

export type Filter<TSchema> =
  | Partial<TSchema>
  | ({
      [Property in Join<NestedPaths<TSchema>, '.'>]?: Condition<
        PropertyType<TSchema, Property>
      >
    } & RootFilterOperators<TSchema>)
