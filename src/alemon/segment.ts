import { ABuffer } from 'alemonjs'
export const segmentONE = {
  at: (uid: string): string => {
    return `<@${uid}>`
  },
  atAll: (): string => {
    return `<@everyone>`
  },
  img: ABuffer.getPath,
  qrcode: ABuffer.qrcode,
  http: (url: string) => {
    return `<http>${url}</http>`
  },
  link: (name: string, url: string): string => {
    return `[${name}](${url})`
  }
}
