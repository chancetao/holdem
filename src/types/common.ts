export interface PlayerProfile {
  id: string
  name: string
  color: string
  avatar?: string
}

export interface IMessage {
  id: string
  player: PlayerProfile
  content: string
  time: number
}
