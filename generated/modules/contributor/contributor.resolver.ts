import {
  Arg,
  Args,
  Mutation,
  Query,
  Root,
  Resolver,
  FieldResolver,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Info,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { Inject } from 'typedi';
import { Min } from 'class-validator';
import {
  Fields,
  StandardDeleteResponse,
  UserId,
  PageInfo,
  RawFields,
  NestedFields,
  BaseContext,
} from '@subsquid/warthog';

import {
  ContributorCreateInput,
  ContributorCreateManyArgs,
  ContributorUpdateArgs,
  ContributorWhereArgs,
  ContributorWhereInput,
  ContributorWhereUniqueInput,
  ContributorOrderByEnum,
} from '../../warthog';

import { Contributor } from './contributor.model';
import { ContributorService } from './contributor.service';

import { Contribution } from '../contribution/contribution.model';
import { ContributionService } from '../contribution/contribution.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@ObjectType()
export class ContributorEdge {
  @Field(() => Contributor, { nullable: false })
  node!: Contributor;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class ContributorConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [ContributorEdge], { nullable: false })
  edges!: ContributorEdge[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@ArgsType()
export class ConnectionPageInputOptions {
  @Field(() => Int, { nullable: true })
  @Min(0)
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string; // V3: TODO: should we make a RelayCursor scalar?

  @Field(() => Int, { nullable: true })
  @Min(0)
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@ArgsType()
export class ContributorConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => ContributorWhereInput, { nullable: true })
  where?: ContributorWhereInput;

  @Field(() => ContributorOrderByEnum, { nullable: true })
  orderBy?: [ContributorOrderByEnum];
}

@Resolver(Contributor)
export class ContributorResolver {
  constructor(@Inject('ContributorService') public readonly service: ContributorService) {}

  @Query(() => [Contributor])
  async contributors(
    @Args() { where, orderBy, limit, offset }: ContributorWhereArgs,
    @Fields() fields: string[]
  ): Promise<Contributor[]> {
    return this.service.find<ContributorWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Contributor, { nullable: true })
  async contributorByUniqueInput(
    @Arg('where') where: ContributorWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<Contributor | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => ContributorConnection)
  async contributorsConnection(
    @Args() { where, orderBy, ...pageOptions }: ContributorConnectionWhereArgs,
    @Info() info: any
  ): Promise<ContributorConnection> {
    const rawFields = graphqlFields(info, {}, { excludedFields: ['__typename'] });

    let result: any = {
      totalCount: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    // If the related database table does not have any records then an error is thrown to the client
    // by warthog
    try {
      result = await this.service.findConnection<ContributorWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<ContributorConnection>;
  }

  @FieldResolver(() => Contribution)
  async contributions(@Root() r: Contributor, @Ctx() ctx: BaseContext): Promise<Contribution[] | null> {
    return ctx.dataLoader.loaders.Contributor.contributions.load(r);
  }
}
