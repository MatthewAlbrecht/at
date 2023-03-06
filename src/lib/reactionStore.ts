import { map } from 'nanostores'
import { getReactionCountKey } from './utils'

export type ReactionCount = {
  contentfulId: string
  reactionVariant: ReactionVariantEnum
  totalCount: number
  totalCountCurrentIP: number
}
export type ReactionCountMap = Record<string, ReactionCount>

export const ReactionVariant = {
  LIKE: 'LIKE',
  LOVE: 'LOVE',
  BOOTS: 'BOOTS',
  WALK: 'WALK',
  CAMP: 'CAMP',
} as const
export type ReactionVariantEnum = keyof typeof ReactionVariant
export const ReactionVariantIconMap = {
  [ReactionVariant.LIKE]: '👍',
  [ReactionVariant.LOVE]: '❤️',
  [ReactionVariant.BOOTS]: '🥾',
  [ReactionVariant.WALK]: '🚶🏽‍♂️',
  [ReactionVariant.CAMP]: '⛺️',
}

export const reactionCounts = map<ReactionCountMap>({})

export const initializeReactionCounts = (counts: ReactionCountMap) => {
  reactionCounts.set(counts)
}

export const incrementReactionCount = (
  contentfulId: string,
  reactionVariant: ReactionVariantEnum,
  amount = 1
) => {
  console.log('===HERE===', 'incrementReactionCount')
  const entries = { ...reactionCounts.get() }
  const key = getReactionCountKey(contentfulId, reactionVariant)
  const entry = entries[key]

  reactionCounts.setKey(
    key,
    entry
      ? {
          ...entry,
          totalCount: entry.totalCount + amount,
          totalCountCurrentIP: entry.totalCountCurrentIP + amount,
        }
      : {
          contentfulId,
          reactionVariant,
          totalCount: 1,
          totalCountCurrentIP: 1,
        }
  )
}
