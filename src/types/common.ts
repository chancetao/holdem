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
  ready: boolean

  handCards: [string, string] | []
}

export interface IMessage {
  id: string
  player: PlayerProfile
  content: string
  time: number
}
