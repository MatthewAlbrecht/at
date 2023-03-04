import { Entry, Asset } from 'contentful'
export const CheckIn = 'checkIn'
import type { Document } from '@contentful/rich-text-types'

export interface CheckIn {
  //Check In
  /*  */
  readonly date: string
  readonly location?: string
  readonly media?: ReadonlyArray<Asset>
  readonly mileMarker: number
  readonly note?: Document
  readonly title: string
}
