import {Resolver, ObjectType, Field, Query} from "type-graphql"
import {InjectManager} from "typeorm-typedi-extensions"
import {EntityManager} from "typeorm"
import {Contribution, Contributor} from "../generated/model"


@ObjectType()
export class Metrics {
  @Field(() => Number, { nullable: false })
  totalContributions!: number
  @Field(() => Number, { nullable: false })
  totalContributors!: number

  constructor(totalContributions: number, totalContributors: number) {
    this.totalContributions = totalContributions
    this.totalContributors = totalContributors
  }
}


@Resolver()
export class MetricsResolver {
  constructor(
    @InjectManager() private db: EntityManager
  ) {}

  @Query(() => Metrics)
  async metrics(): Promise<Metrics> {
    let count = await this.db.getRepository(Contribution).createQueryBuilder().getCount()
    let indCount = await this.db.getRepository(Contributor).createQueryBuilder().getCount()
    return new Metrics(count, indCount)
  }
}