import { conversation } from './alemon/conversation.js'
import { createWsHandler, ClientConfig, config } from './sdk/index.js'
import { Controllers } from './alemon/controller.js'
import { BOTNAME } from './icqq.js'
// alemonjs
import { PlatformsItemType } from 'alemonjs'
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
   * @param responseMessage 调用alemonjs的res消息
   * @param responseEventType 调用alemonjs的res非指令消息
   */
  login: (options: ClientConfig, responseMessage, responseEventType) => {
    if (!options.log_level) {
      options.log_level = 'off'
    }
    // 加载配置
    for (const item in options) {
      config.set(item as any, options['item'])
    }
    createWsHandler(options, event => {
      if (process.env?.ALEMONJS_EVENT == 'dev') console.info('event', event)
      if (conversation[event.post_type]) {
        if (event.post_type == 'message') {
          conversation[event.post_type](event)
        } else {
          const e = conversation[event.type](event)
          responseMessage(e)
        }
      } else {
        //
      }
    })
  },
  // 控制器
  controllers: Controllers
} as PlatformsItemType
//
export * from './icqq.js'
