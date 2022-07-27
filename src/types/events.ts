import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'

export class CrowdloanContributedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Crowdloan.Contributed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Contributed to a crowd sale. `[who, fund_index, amount]`
   */
  get isV9110(): boolean {
    return this._chain.getEventHash('Crowdloan.Contributed') === 'ad00729b31f26d2879a6f96c1691ed42a69cd4947c75e84221a6bde93a3415bc'
  }

  /**
   * Contributed to a crowd sale. `[who, fund_index, amount]`
   */
  get asV9110(): [Uint8Array, number, bigint] {
    assert(this.isV9110)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Contributed to a crowd sale.
   */
  get isV9230(): boolean {
    return this._chain.getEventHash('Crowdloan.Contributed') === 'a09bba4441a47a7b463e5f26020197386183019a6130ce697a434ee31cc39482'
  }

  /**
   * Contributed to a crowd sale.
   */
  get asV9230(): {who: Uint8Array, fundIndex: number, amount: bigint} {
    assert(this.isV9230)
    return this._chain.decodeEvent(this.event)
  }
}

export class CrowdloanMemoUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Crowdloan.MemoUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A memo has been updated. `[who, fund_index, memo]`
   */
  get isV9110(): boolean {
    return this._chain.getEventHash('Crowdloan.MemoUpdated') === 'bc344a4eda76ae6afcf6577c1083b1c2c61c0a694e1577af3d7767f08dd1fc40'
  }

  /**
   * A memo has been updated. `[who, fund_index, memo]`
   */
  get asV9110(): [Uint8Array, number, Uint8Array] {
    assert(this.isV9110)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A memo has been updated.
   */
  get isV9230(): boolean {
    return this._chain.getEventHash('Crowdloan.MemoUpdated') === '2a9892b8f4e1d06ab30af22f0706a459528fcb9a6f3f85b25bd4d895be00bef7'
  }

  /**
   * A memo has been updated.
   */
  get asV9230(): {who: Uint8Array, paraId: number, memo: Uint8Array} {
    assert(this.isV9230)
    return this._chain.decodeEvent(this.event)
  }
}
