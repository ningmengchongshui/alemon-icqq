import { ClientConfig } from './sdk/index.js'
export const BOTNAME = 'icqq'
export interface IcqqLoginMap {
  [key: string]: {
    [BOTNAME]?: ClientConfig
  }
}
