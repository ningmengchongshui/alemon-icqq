import { BaseConfig } from 'alemonjs'
import { Config } from 'icqq'
export interface ClientConfig extends Config {
  masterID?: string
  account: number
  password?: string
}
export const config = new BaseConfig<ClientConfig>({
  sign_api_addr: 'http://127.0.0.1:8080/',
  account: 0,
  log_level: 'off'
})
