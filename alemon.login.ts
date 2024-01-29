import { ALoginOptions } from 'alemonjs'
import { type IcqqLoginMap } from './src/index.js'
// 登录配置支持载入
export default ALoginOptions<IcqqLoginMap>({
  test: {
    icqq: {}
  }
})
