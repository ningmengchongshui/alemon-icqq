import { ABuffer } from 'alemonjs'
import { client } from '../sdk/wss.js'
import { segment } from 'icqq'

/**
 * 回复控制器
 * @param msg
 * @param villa_id
 * @param room_id
 * @returns
 */
export async function directController(
  msg: Buffer | string | number | (Buffer | number | string)[],
  user_id: string
) {
  // is buffer
  if (Buffer.isBuffer(msg)) {
    try {
      return {
        middle: [],
        backhaul: await client.sendPrivateMsg(
          Number(user_id),
          segment.image(msg)
        )
      }
    } catch (err) {
      console.error(err)
      return { middle: [], backhaul: false }
    }
  }

  if (Array.isArray(msg) && msg.find(item => Buffer.isBuffer(item))) {
    const isBuffer = msg.findIndex(item => Buffer.isBuffer(item))
    const cont = msg
      .map(item => {
        if (typeof item === 'number') return String(item)
        return item
      })
      .filter(element => typeof element === 'string')
      .join('')
    try {
      const buff = msg[isBuffer] as Buffer
      return {
        middle: [],
        backhaul: await client.sendPrivateMsg(
          Number(user_id),
          segment.image(buff)
        )
      }
    } catch (err) {
      console.error(err)
      return { middle: [], backhaul: false }
    }
  }

  const content = Array.isArray(msg)
    ? msg.join('')
    : typeof msg === 'string'
    ? msg
    : typeof msg === 'number'
    ? `${msg}`
    : ''

  if (content == '') return { middle: [], backhaul: false }

  /**
   * http
   */

  const match = content.match(/<http>(.*?)<\/http>/)
  if (match) {
    const getUrl = match[1]
    const msg = await ABuffer.getUrl(getUrl)
    if (Buffer.isBuffer(msg)) {
      return {
        middle: [],
        backhaul: await client.sendPrivateMsg(
          Number(user_id),
          segment.image(msg)
        )
      }
    }
  }

  return {
    middle: [],
    backhaul: await client.sendPrivateMsg(Number(user_id), content)
  }
}
