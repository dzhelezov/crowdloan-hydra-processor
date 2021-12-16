import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Contributor } from './contributor.model';

import { ContributorWhereArgs, ContributorWhereInput } from '../../warthog';

import { Contribution } from '../contribution/contribution.model';
import { ContributionService } from '../contribution/contribution.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('ContributorService')
export class ContributorService extends HydraBaseService<Contributor> {
  @Inject('ContributionService')
  public readonly contributionsService!: ContributionService;

  constructor(@InjectRepository(Contributor) protected readonly repository: Repository<Contributor>) {
    super(Contributor, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Contributor[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Contributor[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Contributor> {
    const where = <ContributorWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { contributions_some, contributions_none, contributions_every } = where;

    if (+!!contributions_some + +!!contributions_none + +!!contributions_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.contributions_some;
    delete where.contributions_none;
    delete where.contributions_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    const contributionsFilter = contributions_some || contributions_none || contributions_every;

    if (contributionsFilter) {
      const contributionsQuery = this.contributionsService
        .buildFindQueryWithParams(<any>contributionsFilter, undefined, undefined, ['id'], 'contributions')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...contributionsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'contributor.contributions',
          'contributions_filtered',
          `contributions_filtered.id IN (${contributionsQuery.getQuery()})`
        )
        .groupBy('contributor_id')
        .addSelect('count(contributions_filtered.id)', 'cnt_filtered')
        .addSelect('contributor.id', 'contributor_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('contributor.contributions', 'contributions_total')
        .groupBy('contributor_id')
        .addSelect('count(contributions_total.id)', 'cnt_total')
        .addSelect('contributor.id', 'contributor_id');

      const subQuery = `
                SELECT
                    f.contributor_id contributor_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.contributor_id = f.contributor_id`;

      if (contributions_none) {
        mainQuery = mainQuery.andWhere(`contributor.id IN
                (SELECT
                    contributions_subq.contributor_id
                FROM
                    (${subQuery}) contributions_subq
                WHERE
                    contributions_subq.cnt_filtered = 0
                )`);
      }

      if (contributions_some) {
        mainQuery = mainQuery.andWhere(`contributor.id IN
                (SELECT
                    contributions_subq.contributor_id
                FROM
                    (${subQuery}) contributions_subq
                WHERE
                    contributions_subq.cnt_filtered > 0
                )`);
      }

      if (contributions_every) {
        mainQuery = mainQuery.andWhere(`contributor.id IN
                (SELECT
                    contributions_subq.contributor_id
                FROM
                    (${subQuery}) contributions_subq
                WHERE
                    contributions_subq.cnt_filtered > 0
                    AND contributions_subq.cnt_filtered = contributions_subq.cnt_total
                )`);
      }
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}