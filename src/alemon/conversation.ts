import { BotMessage } from './bot.js'
import { DIRECT_MESSAGE } from './message/DIRECT_MESSAGE.js'
import { MESSAGES } from './message/MESSAGES.js'
import { AEvent } from 'alemonjs'
/**
 * 会话控制
 */
export const conversation = {
  meta: (event: any) => {
    //
  },
  message: (event: any): AEvent => {
    if (event.message_type == 'private') {
      return DIRECT_MESSAGE(event)
    } else {
      return MESSAGES(event as any)
    }
  }
}
