import type { EntryCollection } from 'contentful'
import type { CheckIn } from '../../contentfulTypes'

export type Section = {
  friendlyName: string
  mileStart: number
  mileEnd: number
  svgStart: number
  svgEnd: number
}

export const TOTAL_MILES = 2194.3

export const sections: Record<string, Section> = {
  ga: {
    friendlyName: 'Georgia',
    mileStart: 0,
    mileEnd: 78.1,
    svgStart: 1,
    svgEnd: 0.945,
  },
  nc: {
    friendlyName: 'North Carolina',
    mileStart: 78.1,
    mileEnd: 175.7,
    svgStart: 0.945,
    svgEnd: 0.918,
  },
  'nc/tn': {
    friendlyName: 'North Carolina/Tennessee',
    mileStart: 175.7,
    mileEnd: 392.3,
    svgStart: 0.918,
    svgEnd: 0.817,
  },
  tn: {
    friendlyName: 'Tennessee',
    mileStart: 392.3,
    mileEnd: 467,
    svgStart: 0.817,
    svgEnd: 0.794,
  },
  va: {
    friendlyName: 'Virginia',
    mileStart: 467,
    mileEnd: 1008.7,
    svgStart: 0.794,
    svgEnd: 0.565,
  },
  'wv/va': {
    friendlyName: 'West Virginia',
    mileStart: 1008.7,
    mileEnd: 1026.3,
    svgStart: 0.565,
    svgEnd: 0.557,
  },
  md: {
    friendlyName: 'Maryland',
    mileStart: 1026.3,
    mileEnd: 1067.3,
    svgStart: 0.557,
    svgEnd: 0.534,
  },
  pa: {
    friendlyName: 'Pennsylvania',
    mileStart: 1067.3,
    mileEnd: 1297.3,
    svgStart: 0.534,
    svgEnd: 0.403,
  },
  nj: {
    friendlyName: 'New Jersey',
    mileStart: 1297.3,
    mileEnd: 1369.6,
    svgStart: 0.403,
    svgEnd: 0.361,
  },
  ny: {
    friendlyName: 'New York',
    mileStart: 1369.6,
    mileEnd: 1459.9,
    svgStart: 0.361,
    svgEnd: 0.326,
  },
  ct: {
    friendlyName: 'Connecticut',
    mileStart: 1459.9,
    mileEnd: 1509.9,
    svgStart: 0.326,
    svgEnd: 0.279,
  },
  ma: {
    friendlyName: 'Massachusetts',
    mileStart: 1509.9,
    mileEnd: 1600.8,
    svgStart: 0.279,
    svgEnd: 0.242,
  },
  vt: {
    friendlyName: 'Vermont',
    mileStart: 1600.8,
    mileEnd: 1751.5,
    svgStart: 0.242,
    svgEnd: 0.159,
  },
  nh: {
    friendlyName: 'New Hampshire',
    mileStart: 1751.5,
    mileEnd: 1912.5,
    svgStart: 0.159,
    svgEnd: 0.11,
  },
  me: {
    friendlyName: 'Maine',
    mileStart: 1912.5,
    mileEnd: TOTAL_MILES,
    svgStart: 0.11,
    svgEnd: 0,
  },
}

function getSectionFromMileMarker(mileMarker: number) {
  return Object.entries(sections).find(([, { mileStart, mileEnd }]) => {
    return mileMarker >= mileStart && mileMarker <= mileEnd
  })
}

function getSectionPercentComplete(mileMarker: number, section: Section) {
  const { mileStart, mileEnd } = section
  return (mileMarker - mileStart) / (mileEnd - mileStart)
}

function getTrailLinePercentComplete(
  sectionPercentComplete: number,
  section: Section
) {
  const { svgStart, svgEnd } = section
  return svgStart + (svgEnd - svgStart) * sectionPercentComplete
}

export function getCurrentSectionDetails(checkIns: EntryCollection<CheckIn>) {
  const currentMileMarker = checkIns.items.reduce(
    (acc, { fields: { mileMarker } }) => Math.max(acc, mileMarker),
    0
  )

  const currentSection =
    getSectionFromMileMarker(currentMileMarker)?.[1] ||
    Object.entries(sections)[-1]![1]

  const sectionPercentComplete = getSectionPercentComplete(
    currentMileMarker,
    currentSection
  )

  const trailLinePercentComplete = getTrailLinePercentComplete(
    sectionPercentComplete,
    currentSection
  )
  return {
    currentSectionName: currentSection.friendlyName,
    trailLinePercentComplete,
    currentMileMarker,
  }
}
