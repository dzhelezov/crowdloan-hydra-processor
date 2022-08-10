import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Contributor} from "./contributor.model"

@Entity_()
export class Contribution {
  constructor(props?: Partial<Contribution>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Contributor, {nullable: true})
  account!: Contributor

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  balance!: bigint | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  blockNumber!: bigint

  @Index_()
  @Column_("text", {nullable: false})
  extrinsicHash!: string

  @Column_("bool", {nullable: true})
  earlyBird!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  prevContributed!: boolean | undefined | null

  @Index_()
  @Column_("text", {nullable: true})
  referralCode!: string | undefined | null
}
