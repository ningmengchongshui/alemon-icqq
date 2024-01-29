import { config } from '../../sdk/index.js'
import { BotMessage } from '../bot.js'
import { segmentONE } from '../segment.js'
import { replyController } from '../reply.js'
import { directController } from '../direct.js'
// alemonjs
import {
  type EventEnum,
  type TypingEnum,
  type MessageBingdingOption,
  type AEvent
} from 'alemonjs'
/**
 * 公信事件
 * @param socket
 * @param event
 * @returns
 */
export function MESSAGES(event: any): AEvent {
  const masterID = config.get('masterID')

  /**
   * group中
   * guild_id = channel_id = group_id
   */

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
    guild_id: event.group_id,
    guild_avatar: '',
    guild_name: event.group_name,
    channel_name: '',
    channel_id: event.group_id,
    attachments: [],
    specials: [],
    at: false,
    at_user: undefined,
    at_users: [],
    msg_txt: event.raw_message,
    msg: event.raw_message.trim(),
    msg_id: event.message_id,
    open_id: event.user_id,
    quote: '',
    user_id: event.user_id,
    user_avatar:
      event.platform == 'qq'
        ? `https://q1.qlogo.cn/g?b=qq&s=0&nk=${event.user_id}`
        : 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638',
    user_name: event.sender.nickname,
    segment: segmentONE,
    send_at: new Date().getTime(),
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
      if (select?.open_id && select?.open_id != '') {
        return await directController(msg, select?.open_id)
      }
      const guild_id = select?.guild_id ?? event.group_id
      return await replyController(msg, guild_id)
    }
  }

  const arr: {
    qq: number
    text: string
    user_id: number
  }[] = []

  for (const item of event.message) {
    if (item.type == 'mention') {
      arr.push(item.data)
      e.at_users.push({
        avatar: '',
        bot: false,
        id: item.data.user_id,
        name: item.data.text.replace(/^@/, '')
      })
    }
  }

  for (const item of arr) {
    e.msg = e.msg.replace(item.text, '').trim()
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
