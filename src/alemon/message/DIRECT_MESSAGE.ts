import { config } from '../../sdk/index.js'
import { BotMessage } from '../bot.js'
import { segmentONE } from '../segment.js'
import { directController } from '../direct.js'
// alemonjs
import {
  type EventEnum,
  type TypingEnum,
  type MessageBingdingOption,
  type AEvent
} from 'alemonjs'
// icqq
import { PrivateMessage } from 'icqq'

/**
 * 私信事件
 * @param socket
 * @param event
 * @returns
 */
export function DIRECT_MESSAGE(event: PrivateMessage): AEvent {
  const masterID = config.get('masterID')
  const user_id = String(event.sender.user_id)
  const e = {
    platform: 'icqq',
    event: 'MESSAGES' as (typeof EventEnum)[number],
    typing: 'CREATE' as (typeof TypingEnum)[number],
    boundaries: 'private' as 'publick' | 'private',
    attribute: 'single' as 'group' | 'single',
    bot: BotMessage.get(),
    isMaster: Array.isArray(masterID)
      ? masterID.includes(user_id)
      : user_id == masterID,
    guild_id: '',
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: '',
    attachments: event.message ?? [],
    specials: [],
    //
    at: false,
    at_user: undefined,
    at_users: [],
    msg_txt: event.raw_message,
    msg: event.raw_message.trim(),
    msg_id: event.message_id,
    quote: String(event.seq),
    open_id: user_id,
    //
    user_id: user_id,
    user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
    user_name: event.sender.nickname,
    send_at: new Date().getTime(),
    segment: segmentONE,
    /**
     * 消息发送机制
     * @param msg 消息
     * @param img
     * @returns
     */
    reply: async (
      msg: Buffer | string | number | (Buffer | number | string)[],
      select?: MessageBingdingOption
    ): Promise<any> => {
      return await directController(msg, user_id)
    }
  }
  return e
}
