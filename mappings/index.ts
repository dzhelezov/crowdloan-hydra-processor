import BN from 'bn.js'
import { DatabaseManager, EventContext, StoreContext } from '@subsquid/hydra-common'
import { Contribution, Contributor } from '../generated/model'
import { Contributions } from '../chain'

const altairContributions = require('./altair-contributions.json')

const PARA_ID = 2031;
const CRWD_START = 8146654;
const CRWD_EARLYBIRD_LENGTH = 86400; // (144h * 60m * 60s) / 6s

export async function processContribution({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {
  const [from, paraID, value] = new Contributions.ContributionEvent(event).params

  if (Number(paraID) != PARA_ID) {
    return
  }

  console.log("Processing contribution for ", PARA_ID)
  const contributor = await getOrCreate(store, Contributor, from.toHex())
  contributor.totalContributed = contributor.totalContributed || new BN(0)
  contributor.totalContributed = contributor.totalContributed.add(new BN(value))
  contributor.paraId = Number(paraID)
  contributor.countContributions = contributor.countContributions || 0;
  contributor.countContributions = contributor.countContributions + 1;
  await store.save(contributor)

  const contribID = `${from.toHex()}-${extrinsic?.hash}`;
  const contribution = await getOrCreate(store, Contribution, contribID)
  contribution.account = contributor
  contribution.balance = new BN(value)
  contribution.blockNumber = new BN(block.height)
  contribution.extrinsicHash = extrinsic?.hash ? extrinsic?.hash : ""
  contribution.prevContributed = from.toHex() in altairContributions
  contribution.earlyBird = new BN(block.height).cmp(new BN(CRWD_START+CRWD_EARLYBIRD_LENGTH)) < 1
  await store.save(contribution)
}

export async function processMemo({
  store,
  event,
  block,
  extrinsic,
}: EventContext & StoreContext): Promise<void> {
  const [from, paraID, memo] = new Contributions.MemoUpdatedEvent(event).params

  if (Number(paraID) != PARA_ID) {
    return
  }

  console.log("Processing Memo Events for ", PARA_ID)
  const contributor = await getOrCreate(store, Contributor, from.toHex())
  contributor.paraId = Number(paraID)
  await store.save(contributor)

  const contribID = `${from.toHex()}-${extrinsic?.hash}`
  const contribution = await getOrCreate(store, Contribution, contribID)
  contribution.account = contributor
  contribution.blockNumber = new BN(block.height)
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