import { Client, createClient } from 'icqq'
import { ClientConfig } from './config.js'
import inquirer from 'inquirer'
import * as lodash from 'lodash-es'
import fetch from 'node-fetch'

async function getTicket(url: string, uin: number) {
  //
  const req = `https://hlhs-nb.cn/captcha/slider?key=${uin}`

  //
  await fetch(req, {
    method: 'POST',
    body: JSON.stringify({ url })
  })

  console.log('\n----请打开下方链接并在2分钟内进行验证----')
  console.log(`${console.info(req)}\n----完成后将自动进行登录----`)

  for (let i = 0; i < 40; i++) {
    const res = await fetch(req, {
      method: 'POST',
      body: JSON.stringify({ submit: uin })
    }).then(res => res?.json())
    if (res.data?.ticket) return res.data.ticket
    await sleep(3000)
  }
}

async function requestCode(url: string) {
  const txhelper: any = {
    url: url.replace('ssl.captcha.qq.com', 'txhelper.glitch.me')
  }
  txhelper.req = await fetch(txhelper.url).catch(err =>
    console.log(err.toString())
  )

  if (!txhelper.req?.ok) return false

  txhelper.req = await txhelper.req.text()
  if (!txhelper.req.includes('使用请求码')) return false

  txhelper.code = /\d+/g.exec(txhelper.req)
  if (!txhelper.code) return false

  console.log(
    `\n请打开滑动验证app，输入请求码${
      '【' + txhelper.code + '】'
    }，然后完成滑动验证\n`
  )

  await sleep(200)
  await inquirer.prompt({
    message: '验证完成后按回车确认，等待在操作中...',
    name: 'enter'
  })

  txhelper.res = await fetch(txhelper.url).catch(err =>
    console.log(err.toString())
  )

  if (!txhelper.res) return false
  //
  txhelper.res = await txhelper.res.text()

  if (!txhelper.res) return false
  if (txhelper.res == txhelper.req) {
    console.log('\n未完成滑动验证')
    return false
  }

  console.log(`\n获取ticket成功：\n${txhelper.res}\n`)
  return lodash.trim(txhelper.res)
}

/**
 * 延时
 * @param ms
 * @returns
 */
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 监听上线事件
 */
let inSlider = false

let client: Client

/**
 * 创建连接
 * @param options
 * @param fun
 */
export function createWsHandler(
  options: ClientConfig,
  fun: (...args: any[]) => any
) {
  client = createClient(options)

  // 监听上线
  client.on('system.online', e => {
    console.log('Logged in!')
  })

  // 监听下线
  client.on('system.offline', e => {
    console.log('offline')
  })

  // 消息
  client.on('message', fun)

  // 扫码事件
  client.on('system.login.qrcode', async e => {
    //扫码后按回车登录
    console.info(
      `请使用登录当前QQ的手机扫码完成登录，如果显示二维码过期，可以按回车键（Enter）刷新`
    )

    /** 获取扫码结果 */
    let time = 0
    let interval = setInterval(async () => {
      time++
      let res = await this.client.queryQrcodeResult()
      if (res.retcode === 0) {
        inSlider = true
        console.log('\n')
        console.info(console.info('扫码成功，开始登录...'))
        console.log('\n')
        await sleep(1000)
        this.client.qrcodeLogin()
        clearInterval(interval)
      }
      if (time >= 150) {
        clearInterval(interval)
        console.error('等待扫码超时，已停止运行')
        process.exit()
      }
    }, 2000)

    /** 刷新二维码 */
    inquirer
      .prompt({
        message: '回车刷新二维码，等待扫码中...\n',
        name: 'enter'
      })
      .then(async () => {
        if (!inSlider) {
          clearInterval(interval)
          console.log('  重新刷新二维码...\n\n')
          await sleep(1000)
          this.client.fetchQrcode()
        }
      })
  })

  client.on('system.login.device', async event => {
    //扫码后按回车登录
    global.inputTicket = false
    console.log(
      `\n\n------------------'↓↓设备锁验证↓↓'----------------------\n`
    )
    const ret = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '触发设备锁验证，请选择验证方式:',
        choices: ['1.网页扫码验证', '2.发送短信验证码到密保手机']
      }
    ])

    await sleep(200)

    if (ret.type == '1.网页扫码验证') {
      console.log('\n' + event.url + '\n')
      console.log('请打开上面链接，完成验证后按回车')
      await inquirer.prompt({
        message: '等待操作中...',
        name: 'enter'
      })
      await this.client.login()
    } else {
      console.log('\n')
      this.client.sendSmsCode()
      await sleep(200)
      console.info(`验证码已发送：${event.phone}\n`)
      const res = await inquirer.prompt({
        message: '请输入短信验证码:',
        name: 'sms'
      })
      await this.client.submitSmsCode(res.sms)
    }
  })

  client.on('system.login.slider', async event => {
    inSlider = true
    console.log(
      `\n\n------------------${console.info(
        '↓↓滑动验证链接↓↓'
      )}----------------------\n`
    )
    console.log(console.info(event.url))
    console.log('\n--------------------------------------------------------')
    console.log(
      `提示：打开上面链接获取ticket，可使用${console.info(
        '【滑动验证app】'
      )}获取`
    )
    console.log(
      `链接存在${console.info('有效期')}，请尽快操作，多次操作失败可能会被冻结`
    )
    console.log(
      '滑动验证app下载地址：https://wwp.lanzouy.com/i6w3J08um92h 密码:3kuu\n'
    )

    const ret = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '触发滑动验证，需要获取ticket通过验证，请选择获取方式:',
        choices: [
          '0.自动获取ticket',
          '1.手动获取ticket',
          '2.滑动验证app请求码获取'
        ]
      }
    ])

    await sleep(200)

    let ticket

    if (ret.type == '0.自动获取ticket') {
      ticket = await getTicket(event.url, options.account)
      if (!ticket) console.log('\n请求错误，返回手动获取ticket方式\n')
    }

    if (ret.type == '2.滑动验证app请求码获取') {
      ticket = await requestCode(event.url)
      if (!ticket) console.log('\n请求错误，返回手动获取ticket方式\n')
    }

    if (!ticket) {
      const res = await inquirer.prompt({
        message: '请输入ticket:',
        name: 'ticket',
        validate(value) {
          if (!value) return 'ticket不能为空'
          if (value.toLowerCase() == 'ticket') return '请输入获取的ticket'
          if (value == event.url) return '请勿输入滑动验证链接'
          return true
        }
      })
      ticket = lodash.trim(res.ticket, '"')
    }
    global.inputTicket = true
    this.client.submitSlider(ticket.trim())
  })

  // 登录错误
  client.on('system.login.error', async event => {
    if (event.code === 1) {
      console.error('QQ密码错误，运行命令重新登录：node app login')
    }
    if (global.inputTicket && event.code == 237) {
      console.error(`ticket输入错误或者已失效，已停止运行，请重新登录验证`)
    } else if (event?.message.includes('冻结')) {
      console.error('账号已被冻结，已停止运行')
    } else {
      console.error('登录错误，已停止运行')
    }
    process.exit()
  })

  /**
   * 开始登录
   */
  if (!options.password) {
    client.login(options.account)
  } else {
    client.login(options.account, options.password)
  }
}

export { client }
