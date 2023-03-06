import type { ReactionVariantEnum } from './reactionStore'

export async function getIp() {
  try {
    if (window.localStorage.getItem('ip')) {
      console.log(
        'IP address found in localStorage',
        window.localStorage.getItem('ip')
      )
      return window.localStorage.getItem('ip')
    }
  } catch (error) {
    console.error(error)
    return null
  }
  // Connect ipapi.co with fetch()
  const response = await fetch('https://ipapi.co/json/')
  const data = await response.json()
  // Set the IP address to the constant `ip`
  window.localStorage.setItem('ip', data.ip)
  console.log('IP address found in API', data.ip)
  return data.ip
}

export const getReactionCountKey = (
  contentfulId: string,
  reactionVariant: ReactionVariantEnum
) => `${contentfulId}:${reactionVariant}`
