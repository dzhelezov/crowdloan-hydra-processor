import * as ss58 from "@subsquid/ss58"
import { lookupArchive } from "@subsquid/archive-registry"
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import { CrowdloanContributedEvent, CrowdloanMemoUpdatedEvent } from "./types/events"
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { In } from "typeorm"
import assert from "assert"
import { map, union } from 'lodash'
import { Contribution, Contributor } from "./model"
import { toHex } from '@subsquid/util-internal-hex'
import { isAscii, u8aToString, u8aToHex } from '@polkadot/util'

const altairContributions = require('../assets/altair-contributions.json')

const PARA_ID = 2031;
const CRWD_START = 8146654;
const CRWD_EARLYBIRD_LENGTH = 86400; // (144h * 60m * 60s) / 6s

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

const processor = new SubstrateBatchProcessor()
    .setBatchSize(2000)
    .setBlockRange({ from: 8146654 })
    .setDataSource({
        // Lookup archive by the network name in the Subsquid registry
        archive: lookupArchive("polkadot", { release: "FireSquid" })
    })
    .addEvent('Crowdloan.Contributed', {
        data: { event: { args: true, extrinsic: true }, }
    } as const)
    .addEvent('Crowdloan.MemoUpdated', {
        data: { event: { args: true, extrinsic: true }, }
    } as const)

processor.run(new TypeormDatabase(), async ctx => {
    let contributionEvents = getContributions(ctx).filter(c => c.paraID === PARA_ID)
    let memoEvents = getMemos(ctx).filter(m => m.paraID === PARA_ID)

    const all = [...contributionEvents, ...memoEvents]

    let contributorIds = union(map(contributionEvents, 'who'), ...map(memoEvents, 'from'))
    let contributionIds = all.map((x: ContributionEvent | MemoEvent) => isContributionEvent(x) ? `${x.whoSS58}-${x.extrinsicHash}` : `${x.fromSS58}-${x.extrinsicHash}`)

    // retrieve the existing contributors
    let contributors = await ctx.store.findBy(Contributor, { id: In([...contributorIds]) }).then(c => {
        return new Map(c.map(c => [c.id, c]))
    })

    let contributions = await ctx.store.findBy(Contribution, { id: In([...contributionIds]) }).then(c => {
        return new Map(c.map(c => [c.id, c]))
    })

    contributionEvents.forEach(e => {
        const c = getOrAddContributor(contributors, e.whoHex)
        c.paraID = e.paraID
        assert(c.totalContributed !== undefined && c.totalContributed !== null, 'totalContributed should be initialized')
        c.totalContributed += e.amount
        assert(c.countContributions !== undefined && c.countContributions !== null, 'countContributions should be initialized')
        c.countContributions += 1
    })

    memoEvents.forEach(m => {
        const id = `${m.fromHex}-${m.extrinsicHash}`
        const c = getOrAddContribution(contributions, id)
        c.account = getOrAddContributor(contributors, m.fromHex)
        c.referralCode = m.memo
        c.blockNumber = BigInt(m.blockHeight)
        c.extrinsicHash = m.extrinsicHash
    })

    contributionEvents.forEach(e => {
        const id = `${e.whoHex}-${e.extrinsicHash}`
        const c = getOrAddContribution(contributions, id)
        c.balance = e.amount
        c.account = getOrAddContributor(contributors, e.whoHex)
        c.prevContributed = e.whoHex in altairContributions
        c.earlyBird = (BigInt(e.blockHeight) - (BigInt(CRWD_START + CRWD_EARLYBIRD_LENGTH))) < 1
        c.blockNumber = BigInt(e.blockHeight)
        c.extrinsicHash = e.extrinsicHash
    })

    // save or update the entities in batches
    await ctx.store.save(Array.from(contributors.values()))
    await ctx.store.save(Array.from(contributions.values()))

})

function getOrAddContributor(c: Map<string, Contributor>, id: string): Contributor {
    let ret = c.get(id)
    if (ret == null) {
        ret = new Contributor()
        ret.id = id
        ret.totalContributed = 0n
        ret.countContributions = 0
        c.set(id, ret)
    }
    return ret
}

function getOrAddContribution(c: Map<string, Contribution>, id: string): Contribution {
    let ret = c.get(id)
    if (ret == null) {
        ret = new Contribution()
        ret.id = id
        c.set(id, ret)
    }
    return ret
}


function isContributionEvent(x: ContributionEvent | MemoEvent): x is ContributionEvent {
    return (x as ContributionEvent).whoSS58 !== undefined;
}

function isMemoEvent(x: ContributionEvent | MemoEvent): x is MemoEvent {
    return (x as MemoEvent).fromSS58 !== undefined;
}

interface ContributionEvent {
    whoHex: string
    whoSS58: string
    paraID: number
    amount: bigint
    extrinsicHash: string
    blockHeight: number
}

interface MemoEvent {
    fromHex: string
    fromSS58: string,
    paraID: number,
    memo: string,
    extrinsicHash: string
    blockHeight: number
}

function getMemos(ctx: Ctx): MemoEvent[] {
    let memos: MemoEvent[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == "Crowdloan.MemoUpdated") {
                let e = new CrowdloanMemoUpdatedEvent(ctx, item.event)
                let rec: { who: Uint8Array, paraID: number, memo: Uint8Array }
                if (e.isV9110) {
                    let [who, paraID, memo] = e.asV9110
                    rec = { who, paraID, memo }
                } else if (e.isV9230) {
                    let { who, paraId, memo } = e.asV9230
                    rec = { who, paraID: paraId, memo }
                } else {
                    throw new Error(`Unsupported Crowdloan.MemoUpdated version`)
                }
                assert(item.event.extrinsic?.hash !== undefined, `Crowdloan.MemoUpdated is undefined`)
                const normalized: MemoEvent = {
                    fromSS58: ss58.codec('polkadot').encode(rec.who),
                    fromHex: toHex(rec.who),
                    paraID: rec.paraID,
                    memo: polkadotJsToHuman(rec.memo),
                    extrinsicHash: item.event.extrinsic?.hash,
                    blockHeight: block.header.height
                }

                ctx.log.debug(`MemoEvent: ${stringify(normalized)}`)
                memos.push(normalized)
            }
        }
    }
    return memos
}

function getContributions(ctx: Ctx): ContributionEvent[] {
    let contributions: ContributionEvent[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == "Crowdloan.Contributed") {
                let e = new CrowdloanContributedEvent(ctx, item.event)
                let rec: { who: Uint8Array, paraId: number, amount: bigint }
                if (e.isV9110) {
                    let [who, paraId, amount,] = e.asV9110
                    rec = { who, paraId, amount }
                } else if (e.isV9230) {
                    let { who, fundIndex, amount } = e.asV9230
                    rec = { who, paraId: fundIndex, amount }
                } else {
                    throw new Error(`Unsupported Crowdloan.Contributed version`)
                }
                assert(item.event.extrinsic?.hash !== undefined, `Crowdloan.Contributed is undefined`)
                const normalized: ContributionEvent = {
                    whoHex: toHex(rec.who),
                    whoSS58: ss58.codec('polkadot').encode(rec.who),
                    paraID: rec.paraId,
                    amount: rec.amount,
                    extrinsicHash: item.event.extrinsic?.hash,
                    blockHeight: block.header.height
                }

                ctx.log.debug(`ContributionEvent: ${stringify(normalized)}`)
                contributions.push(normalized)
            }
        }
    }
    return contributions
}

function stringify(s: any): string {
    return JSON.stringify(s, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    )
}

function polkadotJsToHuman(s: Uint8Array): string {
    if (isAscii(s)) {
        const text = u8aToString(s);

        // ensure we didn't end up with multibyte codepoints
        if (isAscii(text)) {
            return text;
        }
    }

    return u8aToHex(s)
}