import { BaseModel, BooleanField, NumericField, Model, ManyToOne, StringField, JSONField } from '@subsquid/warthog';

import BN from 'bn.js';

import { Contributor } from '../contributor/contributor.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Contribution extends BaseModel {
  @ManyToOne(() => Contributor, (param: Contributor) => param.contributions, {
    skipGraphQLField: true,

    modelName: 'Contribution',
    relModelName: 'Contributor',
    propertyName: 'account',
  })
  account!: Contributor;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  balance?: BN;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  blockNumber!: BN;

  @StringField({})
  extrinsicHash!: string;

  @BooleanField({
    nullable: true,
  })
  earlyBird?: boolean;

  @BooleanField({
    nullable: true,
  })
  prevContributed?: boolean;

  @StringField({
    nullable: true,
  })
  referralCode?: string;

  constructor(init?: Partial<Contribution>) {
    super();
    Object.assign(this, init);
  }
}
