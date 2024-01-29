import { BaseConfig, ControllerOption, UserInformationType } from 'alemonjs'
import { replyController } from './reply.js'
import { directController } from './direct.js'

/**
 * 控制器
 */
export class Controllers extends BaseConfig<ControllerOption> {
  constructor(select?: ControllerOption) {
    super(select)
  }
  /**
   * 消息控制器
   * @param param0
   * @returns
   */
  Message = {
    /**
     * 回复
     * @param content
     * @returns
     */
    reply: async (
      content: Buffer | string | number | (Buffer | number | string)[]
    ) => {
      const guild_id = this.get('guild_id')
      const attribute = this.get('attribute')
      const open_id = this.get('open_id')
      if (attribute == 'single') {
        return await directController(content, open_id)
      }
      return await replyController(content, guild_id)
    },
    /**
     * 引用
     * @param content
     * @returns
     */
    quote: async (
      content: Buffer | string | number | (Buffer | number | string)[]
    ) => {},
    /**
     * 更新信息
     * @param content
     * @returns
     */
    update: async (
      content: Buffer | string | number | (Buffer | number | string)[]
    ) => {
      return false
    },
    /**
     * 撤回
     * @returns
     */
    withdraw: async (hideTip: boolean) => {},
    /**
     *  钉选
     * @param cancel
     * @returns
     */
    pinning: async (cancel = false) => {},
    /**
     *  喇叭
     * @param cancel
     * @returns
     */
    horn: async (cancel = false) => {
      return false
    },
    /**
     * 转发
     * @returns
     */
    forward: async () => {
      return false
    },
    /**
     *
     * 表态
     * @param msg
     * @param cancel
     * @returns
     */
    emoji: async (msg: any[], cancel?: boolean) => {
      return []
    },
    /**
     * 音频
     * @param file
     * @param name
     */
    audio: async (file: Buffer | string, name?: string) => {
      return false
    },
    /**
     * 视频
     * @param file
     * @param name
     */
    video: async (file: Buffer | string, name?: string) => {
      return false
    },
    /**
     * 卡片
     * @param msg
     * @returns
     */
    card: async (msg: any[]) => {
      const arr: any[] = []
      return arr
    },
    allUsers: async (
      reactionObj: any,
      options = {
        cookie: '',
        limit: 20
      }
    ) => {
      return false
    },
    article: async (msg: any) => {
      return false
    }
  }

  /**
   * 成员控制器
   * @param param0
   * @returns
   */
  Member = {
    /**
     * 查看信息
     * @returns
     */
    information: async (): Promise<UserInformationType | false> => {
      return false
    },
    /**
     * 禁言
     */
    mute: async (option?: { time?: number; cancel?: boolean }) => {
      //
    },
    /**
     * 踢出
     */
    remove: async () => {},
    /**
     * 身分组
     * @param role_id 身分组编号
     * @param is_add 默认添加行为
     * @returns
     */
    operate: async (role_id: string, add = true) => {}
  }
}
