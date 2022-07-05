import { PlayerStatus } from "@/constants/common";

export interface PlayerProfile {
  id: string
  name: string
  color: string
  avatar?: string
}

export interface IPlayer {
  profile: PlayerProfile
  isSmallBlind: boolean
  isBigBlind: boolean
  allIn: boolean
  chips: number
  handCards: [string, string] | []
  status: PlayerStatus
  det: number
}

export interface IMessage {
  id: string
  player: PlayerProfile
  content: string
  time: number
}
