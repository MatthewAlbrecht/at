import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'

export const post: APIRoute = async ({ request }) => {
  const body = await request.json()

  /* TODO @matthewalbrecht: use zod here */
  const { contentfulId, variant, ipAddress } = body

  const { error, data } = await supabase
    .from('reactions')
    .select()
    .eq('contentful_id', contentfulId)
    .eq('reaction_variant', variant)
    .eq('ip_address', ipAddress)
    .maybeSingle()

  if (error) {
    return {
      body: JSON.stringify({
        error_code: ErrorCode.SelectError,
        message:
          'There was an error selecting an existing record for this reaction',
        error,
      }),
    }
  }

  if (data) {
    if (data.count >= 12)
      return {
        body: JSON.stringify({
          errorCode: ErrorCode.TooManyLikes,
          message: 'You can only like a check-in 12 times',
        }),
      }
    const { error: updateError, data: updateData } = await supabase
      .from('reactions')
      .update({ count: data.count + 1 })
      .eq('contentful_id', contentfulId)
      .eq('reaction_variant', variant)
      .eq('ip_address', ipAddress)
      .select()
      .single()

    if (updateError) {
      console.log('updateError', updateError)
      return {
        body: JSON.stringify({
          error_code: ErrorCode.UpdateError,
          message: 'There was an error during the update',
          error: updateError,
        }),
      }
    }

    return {
      body: JSON.stringify({ data: { reaction: updateData } }),
    }
  }

  const { error: insertError, data: insertData } = await supabase
    .from('reactions')
    .insert([
      {
        contentful_id: contentfulId,
        reaction_variant: variant,
        ip_address: ipAddress,
        count: 1,
      },
    ])
    .select()

  if (insertError) {
    console.log('insertError', insertError)
    return {
      body: JSON.stringify({
        error_code: ErrorCode.InsertError,
        message: 'There was an error during the insert',
        error: insertError,
      }),
    }
  }

  return {
    body: JSON.stringify({ data: { reaction: insertData } }),
  }
}

const ErrorCode = {
  SelectError: 'select_error',
  UpdateError: 'update_error',
  InsertError: 'insert_error',
  TooManyLikes: 'too_many_likes',
}
