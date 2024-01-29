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

/**
 * 私信事件
 * @param socket
 * @param event
 * @returns
 */
export function DIRECT_MESSAGE(event: any): AEvent {
  const masterID = config.get('masterID')
  const e = {
    platform: 'one',
    event: 'MESSAGES' as (typeof EventEnum)[number],
    typing: 'CREATE' as (typeof TypingEnum)[number],
    boundaries: 'publick' as 'publick' | 'private',
    attribute:
      event.detail_type == 'private'
        ? 'single'
        : ('group' as 'group' | 'single'),
    bot: BotMessage.get(),
    isMaster: Array.isArray(masterID)
      ? masterID.includes(event.user_id)
      : event.user_id == masterID,
    guild_id: '',
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: '',
    attachments: [],
    specials: [],
    //
    at: false,
    at_user: undefined,
    at_users: [],
    msg_txt: event.raw_message,
    msg: event.raw_message.trim(),
    msg_id: event.message_id,
    quote: '',
    open_id: event.user_id,
    //
    user_id: event.user_id,
    user_avatar:
      event.platform == 'qq'
        ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${event.user_id}`
        : 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638',
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
      return await directController(msg, event.user_id)
    }
  }

  /**
   * 存在at
   */
  if (e.at) {
    /**
     * 得到第一个艾特
     */
    e.at_user = e.at_users.find(item => item.bot != true)
  }

  return e
}
