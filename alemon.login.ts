import { ALoginOptions } from 'alemonjs'
import { type IcqqLoginMap } from './src/index.js'
export default ALoginOptions<IcqqLoginMap>({
  test: {
    icqq: {
      sign_api_addr: 'https://sign.sjtpab.tk/8993/sign?key=1',
      account: 794161769,
      password: 'Qq002580'
    }
  }
})
