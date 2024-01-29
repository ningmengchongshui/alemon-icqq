import { BaseConfig } from 'alemonjs'
import { Config } from 'icqq'
export interface ClientConfig extends Config {
  masterID?: string
}
export const config = new BaseConfig<ClientConfig>({
  platform: 3,
  ver: '2.1.7',
  sign_api_addr: 'http://127.0.0.1:8080/',
  masterID: ''
})
