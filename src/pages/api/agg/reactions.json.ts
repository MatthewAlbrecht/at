import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'
import type {
  ReactionCount,
  ReactionVariantEnum,
} from '../../../lib/reactionStore'
import { getReactionCountKey } from '../../../lib/utils'

export const post: APIRoute = async ({ request }) => {
  const body = await request.json()
  /* TODO @matthewalbrecht: use zod here */
  const { ipAddress } = body
  const { error, data } = await supabase
    .from('reactions')
    .select()
    .eq('ip_address', ipAddress)
  const { error: aggError, data: aggData } = await supabase
    .from('reaction_counts')
    .select()

  if (error || aggError) {
    return {
      body: JSON.stringify({
        error_code: ErrorCode.SelectError,
        message: 'There was an error selecting the reaction counts',
        error: error || aggError,
      }),
    }
  }

  const totalCountMap = aggData.reduce<Record<string, ReactionCount>>(
    (acc, cur) => {
      const { contentful_id, reaction_variant, sum } = cur
      if (!contentful_id || !reaction_variant || !sum) return acc
      const key = getReactionCountKey(
        contentful_id,
        reaction_variant as ReactionVariantEnum
      )
      acc[key] = {
        contentfulId: contentful_id,
        reactionVariant: reaction_variant as ReactionVariantEnum, // TODO @matthewalbrecht: use zod to ensure this is a valid variant
        totalCount: sum ?? 0,
        totalCountCurrentIP: 0,
      }
      return acc
    },
    {}
  )

  data.forEach((row) => {
    const { contentful_id, reaction_variant, count } = row
    if (!contentful_id || !reaction_variant || !count) return
    const key = getReactionCountKey(
      contentful_id,
      reaction_variant as ReactionVariantEnum
    )
    if (totalCountMap[key]) {
      totalCountMap[key]!.totalCountCurrentIP = count
    }
  })

  return {
    body: JSON.stringify({ data: totalCountMap }),
  }
}

const ErrorCode = {
  SelectError: 'select_error',
  UpdateError: 'update_error',
  InsertError: 'insert_error',
  TooManyLikes: 'too_many_likes',
}
