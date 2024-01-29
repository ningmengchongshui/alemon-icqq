import { BaseBotMessage } from 'alemonjs'
export const BotMessage = new BaseBotMessage<{
  id: string
  name: string
  avatar?: string
}>({
  id: '',
  name: '',
  avatar: ''
})
