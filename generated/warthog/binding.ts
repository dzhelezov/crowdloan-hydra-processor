import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    contributions: <T = Array<Contribution>>(args: { offset?: Int | null, limit?: Int | null, where?: ContributionWhereInput | null, orderBy?: Array<ContributionOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    contributionByUniqueInput: <T = Contribution | null>(args: { where: ContributionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    contributionsConnection: <T = ContributionConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: ContributionWhereInput | null, orderBy?: Array<ContributionOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    contributors: <T = Array<Contributor>>(args: { offset?: Int | null, limit?: Int | null, where?: ContributorWhereInput | null, orderBy?: Array<ContributorOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    contributorByUniqueInput: <T = Contributor | null>(args: { where: ContributorWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    contributorsConnection: <T = ContributorConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: ContributorWhereInput | null, orderBy?: Array<ContributorOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    metrics: <T = Metrics>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {}

export interface Subscription {
    stateSubscription: <T = ProcessorState>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
  delegateSubscription(fieldName: string, args?: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(...args: any[]): T
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema: schema as any })

/**
 * Types
*/

export type ContributionOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'account_ASC' |
  'account_DESC' |
  'balance_ASC' |
  'balance_DESC' |
  'blockNumber_ASC' |
  'blockNumber_DESC' |
  'extrinsicHash_ASC' |
  'extrinsicHash_DESC' |
  'earlyBird_ASC' |
  'earlyBird_DESC' |
  'prevContributed_ASC' |
  'prevContributed_DESC' |
  'referralCode_ASC' |
  'referralCode_DESC'

export type ContributorOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'totalContributed_ASC' |
  'totalContributed_DESC' |
  'paraId_ASC' |
  'paraId_DESC' |
  'countContributions_ASC' |
  'countContributions_DESC'

export interface BaseWhereInput {
  id_eq?: String | null
  id_in?: String[] | String | null
  createdAt_eq?: String | null
  createdAt_lt?: String | null
  createdAt_lte?: String | null
  createdAt_gt?: String | null
  createdAt_gte?: String | null
  createdById_eq?: String | null
  updatedAt_eq?: String | null
  updatedAt_lt?: String | null
  updatedAt_lte?: String | null
  updatedAt_gt?: String | null
  updatedAt_gte?: String | null
  updatedById_eq?: String | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: String | null
  deletedAt_lt?: String | null
  deletedAt_lte?: String | null
  deletedAt_gt?: String | null
  deletedAt_gte?: String | null
  deletedById_eq?: String | null
}

export interface ContributionCreateInput {
  account: ID_Output
  balance?: String | null
  blockNumber: String
  extrinsicHash: String
  earlyBird?: Boolean | null
  prevContributed?: Boolean | null
  referralCode?: String | null
}

export interface ContributionUpdateInput {
  account?: ID_Input | null
  balance?: String | null
  blockNumber?: String | null
  extrinsicHash?: String | null
  earlyBird?: Boolean | null
  prevContributed?: Boolean | null
  referralCode?: String | null
}

export interface ContributionWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  balance_eq?: BigInt | null
  balance_gt?: BigInt | null
  balance_gte?: BigInt | null
  balance_lt?: BigInt | null
  balance_lte?: BigInt | null
  balance_in?: BigInt[] | BigInt | null
  blockNumber_eq?: BigInt | null
  blockNumber_gt?: BigInt | null
  blockNumber_gte?: BigInt | null
  blockNumber_lt?: BigInt | null
  blockNumber_lte?: BigInt | null
  blockNumber_in?: BigInt[] | BigInt | null
  extrinsicHash_eq?: String | null
  extrinsicHash_contains?: String | null
  extrinsicHash_startsWith?: String | null
  extrinsicHash_endsWith?: String | null
  extrinsicHash_in?: String[] | String | null
  earlyBird_eq?: Boolean | null
  earlyBird_in?: Boolean[] | Boolean | null
  prevContributed_eq?: Boolean | null
  prevContributed_in?: Boolean[] | Boolean | null
  referralCode_eq?: String | null
  referralCode_contains?: String | null
  referralCode_startsWith?: String | null
  referralCode_endsWith?: String | null
  referralCode_in?: String[] | String | null
  account?: ContributorWhereInput | null
  AND?: ContributionWhereInput[] | ContributionWhereInput | null
  OR?: ContributionWhereInput[] | ContributionWhereInput | null
}

export interface ContributionWhereUniqueInput {
  id: ID_Output
}

export interface ContributorCreateInput {
  totalContributed?: String | null
  paraId: Float
  countContributions?: Float | null
}

export interface ContributorUpdateInput {
  totalContributed?: String | null
  paraId?: Float | null
  countContributions?: Float | null
}

export interface ContributorWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  totalContributed_eq?: BigInt | null
  totalContributed_gt?: BigInt | null
  totalContributed_gte?: BigInt | null
  totalContributed_lt?: BigInt | null
  totalContributed_lte?: BigInt | null
  totalContributed_in?: BigInt[] | BigInt | null
  paraId_eq?: Int | null
  paraId_gt?: Int | null
  paraId_gte?: Int | null
  paraId_lt?: Int | null
  paraId_lte?: Int | null
  paraId_in?: Int[] | Int | null
  countContributions_eq?: Int | null
  countContributions_gt?: Int | null
  countContributions_gte?: Int | null
  countContributions_lt?: Int | null
  countContributions_lte?: Int | null
  countContributions_in?: Int[] | Int | null
  contributions_none?: ContributionWhereInput | null
  contributions_some?: ContributionWhereInput | null
  contributions_every?: ContributionWhereInput | null
  AND?: ContributorWhereInput[] | ContributorWhereInput | null
  OR?: ContributorWhereInput[] | ContributorWhereInput | null
}

export interface ContributorWhereUniqueInput {
  id: ID_Output
}

export interface BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface DeleteResponse {
  id: ID_Output
}

export interface BaseModel extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface BaseModelUUID extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface Contribution extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  account: Contributor
  accountId: String
  balance?: BigInt | null
  blockNumber: BigInt
  extrinsicHash: String
  earlyBird?: Boolean | null
  prevContributed?: Boolean | null
  referralCode?: String | null
}

export interface ContributionConnection {
  totalCount: Int
  edges: Array<ContributionEdge>
  pageInfo: PageInfo
}

export interface ContributionEdge {
  node: Contribution
  cursor: String
}

export interface Contributor extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  totalContributed?: BigInt | null
  paraId: Int
  countContributions?: Int | null
  contributions: Array<Contribution>
}

export interface ContributorConnection {
  totalCount: Int
  edges: Array<ContributorEdge>
  pageInfo: PageInfo
}

export interface ContributorEdge {
  node: Contributor
  cursor: String
}

export interface Metrics {
  totalContributions: Float
  totalContributors: Float
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface ProcessorState {
  lastCompleteBlock: Float
  lastProcessedEvent: String
  indexerHead: Float
  chainHead: Float
}

export interface StandardDeleteResponse {
  id: ID_Output
}

/*
GraphQL representation of BigInt
*/
export type BigInt = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The javascript `Date` as string. Type represents date and time as the ISO Date string.
*/
export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string