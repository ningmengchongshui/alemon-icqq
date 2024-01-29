import { createClient, Config } from 'icqq'
/**
 * 创建连接
 * @param options
 * @param fun
 */
export function createWsHandler(options: Config, fun: (...args: any[]) => any) {
  const client = createClient(options)
  client.on('system.online', () => console.log('Logged in!'))
  client.on('message', e => {
    fun(e)
  })
  client.on('system.login.qrcode', e => {
    //扫码后按回车登录
    process.stdin.once('data', () => {
      client.login()
    })
  })
  client.login()
}
