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
// icqq
import { GroupMessage } from 'icqq'
import { BOTNAME } from '../../icqq.js'
/**
 * 公信事件
 * @param socket
 * @param event
 * @returns
 */
export function MESSAGES(event: GroupMessage): AEvent {
  const masterID = config.get('masterID')
  const user_id = String(event.sender.user_id)
  const group_id = String(event.group_id)
  const e = {
    platform: BOTNAME,
    event: 'MESSAGES' as (typeof EventEnum)[number],
    typing: 'CREATE' as (typeof TypingEnum)[number],
    boundaries: 'private' as 'publick' | 'private',
    attribute: 'group' as 'group' | 'single',
    bot: BotMessage.get(),
    isMaster: Array.isArray(masterID)
      ? masterID.includes(user_id)
      : user_id == masterID,
    guild_id: group_id,
    guild_avatar: '',
    guild_name: event.group_name,
    channel_name: event.group_name,
    channel_id: group_id,
    attachments: event.message ?? [],
    specials: [],
    at: false,
    at_user: undefined,
    at_users: [],
    msg_txt: event.raw_message,
    msg: event.raw_message.trim(),
    msg_id: event.message_id,
    open_id: user_id,
    quote: String(event.seq),
    user_id: user_id,
    user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`,
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
      const guild_id = select?.guild_id ?? group_id
      return await replyController(msg, guild_id)
    }
  }
  const botAccount = config.get('botAccount')
  for (const msg of event.message) {
    if (msg.type == 'at') {
      e.at = true
      e.at_users.push({
        id: String(msg.qq),
        name: '',
        avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${msg.qq}`,
        bot: botAccount.includes(String(msg.qq))
      })
    }
  }
  if (e.at) {
    e.at_user = e.at_users.find(item => item.bot != true)
  }
  return e
}
