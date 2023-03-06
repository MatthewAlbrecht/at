import { useEffect } from 'react'
import {
  initializeReactionCounts,
  ReactionCountMap,
} from '../lib/reactionStore'
import { getIp } from '../lib/utils'

export default function GetAllReactionCounts() {
  useEffect(() => {
    fetchCounts()

    async function fetchCounts() {
      console.log('===HERE===', 'GetAllReactionCounts')
      const ipAddress = await getIp()
      const response = await fetch('/api/agg/reactions.json', {
        method: 'post',
        body: JSON.stringify({ ipAddress }),
      })
      const data = await response.json()
      /* TODO @matthewalbrecht: use zod to confirm structure */
      console.log('data', data.data)
      initializeReactionCounts(data.data as ReactionCountMap)
    }
  }, [])

  return null
}
