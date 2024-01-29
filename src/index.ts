import { conversation } from './alemon/conversation.js'
import { createWsHandler, ClientConfig, config } from './sdk/index.js'
import { Controllers } from './alemon/controller.js'
import { BOTNAME } from './icqq.js'
// alemonjs
import { APPS, PlatformsItemType } from 'alemonjs'
import { BotMessage } from './alemon/bot.js'

/**
 * name保证唯一性
 * login会执行登录并传入alemonjs-res引用
 * controllers 将推送进控制器集
 */
export default {
  /**
   * 平台名
   */
  name: BOTNAME,
  /**
   * @param options 传入登录配置
   */
  login: (options: ClientConfig) => {
    if (!options.log_level) {
      options.log_level = 'off'
    }
    // 加载配置
    for (const item in options) {
      config.set(item as any, options['item'])
    }

    /**
     * 保存机器人信息
     */
    BotMessage.set('id', String(options.account))
    BotMessage.set(
      'avatar',
      `https://q1.qlogo.cn/g?b=qq&s=0&nk=${options.account}`
    )

    createWsHandler(options, event => {
      if (process.env?.ALEMONJS_EVENT == 'dev') console.info('event', event)
      if (conversation[event.post_type]) {
        const e = conversation[event.post_type](event)
        APPS.responseMessage(e)
      } else {
        // 事件不存在
      }
    })
  },
  // 控制器
  controllers: Controllers
} as PlatformsItemType
//
export * from './icqq.js'
