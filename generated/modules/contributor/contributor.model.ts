import { BaseModel, IntField, NumericField, Model, OneToMany, StringField, JSONField } from '@subsquid/warthog';

import BN from 'bn.js';

import { Contribution } from '../contribution/contribution.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Contributor extends BaseModel {
  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  totalContributed?: BN;

  @IntField({})
  paraId!: number;

  @IntField({
    nullable: true,
  })
  countContributions?: number;

  @OneToMany(() => Contribution, (param: Contribution) => param.account, {
    modelName: 'Contributor',
    relModelName: 'Contribution',
    propertyName: 'contributions',
  })
  contributions?: Contribution[];

  constructor(init?: Partial<Contributor>) {
    super();
    Object.assign(this, init);
  }
}
