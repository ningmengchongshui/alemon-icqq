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
export async function replyController(
  msg: Buffer | string | number | (Buffer | number | string)[],
  guild_id: string
) {
  // is buffer
  if (Buffer.isBuffer(msg)) {
    try {
      return {
        middle: [],
        backhaul: await client.sendGroupMsg(
          Number(guild_id),
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
        backhaul: await client.sendGroupMsg(Number(guild_id), [
          segment.image(buff),
          ...extractContent(cont)
        ])
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
        backhaul: await client.sendGroupMsg(Number(guild_id), [
          segment.image(msg),
          ...extractContent(content)
        ])
      }
    }
  }

  return {
    middle: [],
    backhaul: await client.sendGroupMsg(
      Number(guild_id),
      extractContent(content)
    )
  }
}

function extractContent(input: string): any[] {
  input.replace(/<http>(.*?)<\/http>/g, '')
  const regex = /<@([^>]+)>/g
  let match
  const result = []
  while ((match = regex.exec(input)) !== null) {
    const content1 = match[1]
    const content2 = input.substring(match.index! + match[0].length)
    result.push(
      input.substring(0, match.index),
      segment.at(content1 == 'all' ? 'all' : Number(content1)),
      content2
    )
  }
  if (result.length === 0) {
    return [input]
  }
  return result
}
