import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Contribution} from "./contribution.model"

@Entity_()
export class Contributor {
  constructor(props?: Partial<Contributor>) {
    Object.assign(this, props)
  }

  /**
   * Account address
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalContributed!: bigint | undefined | null

  @Column_("int4", {nullable: false})
  paraID!: number

  @Column_("int4", {nullable: true})
  countContributions!: number | undefined | null

  @OneToMany_(() => Contribution, e => e.account)
  contributions!: Contribution[]
}
