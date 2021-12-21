import { DatabaseManager, EventContext, StoreContext } from '@subsquid/hydra-common'
import { Contribution, Contributor } from '../generated/model'
import { Crowdloan } from '../types'

const altairContributions = require('../../altair-contributions.json')

const PARA_ID = 2031;
const CRWD_START = 8146654;
const CRWD_EARLYBIRD_LENGTH = 86400; // (144h * 60m * 60s) / 6s

export async function processContribution({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {
  const [from, paraID, value] = new Crowdloan.ContributedEvent(event).params

  if (Number(paraID) != PARA_ID) {
    return
  }

  console.log("Processing contribution for ", PARA_ID)
  const contributor = await getOrCreate(store, Contributor, from.toHex())
  contributor.totalContributed = contributor.totalContributed || (0n)
  contributor.totalContributed = contributor.totalContributed + value.toBigInt();
  contributor.paraID = Number(paraID)
  contributor.countContributions = contributor.countContributions || 0;
  contributor.countContributions = contributor.countContributions + 1;
  await store.save(contributor)

  const contribID = `${from.toHex()}-${extrinsic?.hash}`;
  const contribution = await getOrCreate(store, Contribution, contribID)
  contribution.account = contributor
  contribution.balance = value.toBigInt()
  contribution.blockNumber = BigInt(block.height)
  contribution.extrinsicHash = extrinsic?.hash ? extrinsic?.hash : ""
  contribution.prevContributed = from.toHex() in altairContributions
  contribution.earlyBird = (BigInt(block.height) - (BigInt(CRWD_START+CRWD_EARLYBIRD_LENGTH))) < 1
  await store.save(contribution)
}

export async function processMemo({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {
  const [from, paraID, memo] = new Crowdloan.MemoUpdatedEvent(event).params

  if (Number(paraID) != PARA_ID) {
    return
  }

  console.log("Processing Memo Events for ", PARA_ID)
  const contributor = await getOrCreate(store, Contributor, from.toHex())
  contributor.paraID = Number(paraID)
  await store.save(contributor)

  const contribID = `${from.toHex()}-${extrinsic?.hash}`
  const contribution = await getOrCreate(store, Contribution, contribID)
  contribution.account = contributor
  contribution.blockNumber = BigInt(block.height)
  contribution.extrinsicHash = extrinsic?.hash ? extrinsic?.hash : ""
  contribution.referralCode = `${memo.toHuman()}`
  await store.save(contribution)
}

async function getOrCreate<T extends {id: string}>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> {

  let e = await store.get(entityConstructor, {
    where: { id },
  })

  if (e == null) {
    e = new entityConstructor()
    e.id = id
  }

  return e
}

type EntityConstructor<T> = {
  new (...args: any[]): T
}