import {
  ReactionVariantEnum,
  ReactionVariantIconMap,
  incrementReactionCount,
  reactionCounts,
} from '../lib/reactionStore'
import { useStore } from '@nanostores/react'
import { getReactionCountKey, getIp } from '../lib/utils'

type Props = {
  contentfulId: string
  reactionVariant: ReactionVariantEnum
}

export default function ReactionButton({
  contentfulId,
  reactionVariant,
}: Props) {
  const store = useStore(reactionCounts)
  const countDetails = store[getReactionCountKey(contentfulId, reactionVariant)]
  console.log('countDetails', countDetails)
  const totalCount = countDetails ? countDetails.totalCount : 0
  const totalCountCurrentIP = countDetails
    ? countDetails.totalCountCurrentIP
    : 0

  const totalCountOpacity =
    totalCountCurrentIP >= 10
      ? 'opacity-100'
      : totalCountCurrentIP >= 8
      ? 'opacity-80'
      : totalCountCurrentIP >= 6
      ? 'opacity-60'
      : totalCountCurrentIP >= 4
      ? 'opacity-50'
      : totalCountCurrentIP >= 2
      ? 'opacity-40'
      : totalCountCurrentIP
      ? 'opacity-30'
      : 'opacity-25'
  const handleClick = async (variant: ReactionVariantEnum) => {
    if (totalCountCurrentIP >= 12) {
      return
    }
    incrementReactionCount(contentfulId, variant)
    fetch('/api/reactions.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentfulId,
        variant,
        ipAddress: await getIp(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        incrementReactionCount(contentfulId, variant, -1)
        console.error('Error:', error)
      })
  }
  return (
    <div className="">
      <button
        onClick={() => handleClick(reactionVariant)}
        className="flex items-center text-zinc-400"
        disabled={totalCountCurrentIP >= 12}
      >
        <span
          className={`inline-block text-lg transition-[transform] duration-300 hover:scale-110 active:scale-125 active:duration-75`}
        >
          {ReactionVariantIconMap[reactionVariant]}
        </span>
        &nbsp;
        <span
          className={`text-xs font-semibold ${
            totalCountCurrentIP ? 'text-red-500' : 'text-zinc-400'
          }`}
        >
          {totalCount}
        </span>
      </button>
    </div>
  )
}
