## Alemon-Icqq

基于`icqq`的`AlemonJS`机器人

> AlemonJS @1.2.0-rc.20 -- @latest

### Ecosystem

| Project           | Status                                               | Description    |
| ----------------- | ---------------------------------------------------- | -------------- |
| [alemonjs]        | [![alemonjs-status]][alemonjs-package]               | 标准应用解析器 |
| [create-alemonjs] | [![create-alemonjs-status]][create-alemonjs-package] | 模板创建脚手架 |
| [afloat]          | [![afloat-status]][afloat-package]                   | 应用构建工具   |
| [alemon-icqq]     | [![alemon-icqq-status]][alemon-icqq-package]         | icqq 协议      |

>

[alemonjs]: https://github.com/ningmengchongshui/alemonjs
[alemonjs-status]: https://img.shields.io/npm/v/alemonjs.svg
[alemonjs-package]: https://www.npmjs.com/package/alemonjs

>

[create-alemonjs]: https://github.com/ningmengchongshui/alemonjs/tree/create-alemonjs
[create-alemonjs-status]: https://img.shields.io/npm/v/create-alemonjs.svg
[create-alemonjs-package]: https://www.npmjs.com/package/create-alemonjs

>

[afloat]: https://github.com/ningmengchongshui/alemonjs/tree/rollup
[afloat-status]: https://img.shields.io/npm/v/afloat.svg
[afloat-package]: https://www.npmjs.com/package/afloat

>

[alemon-icqq]: https://github.com/ningmengchongshui/alemon-icqq
[alemon-icqq-status]: https://img.shields.io/npm/v/alemon-icqq.svg
[alemon-icqq-package]: https://www.npmjs.com/package/alemon-icqq

### 开始

- 安装

```sh
npm i alemon-icqq
```

- 使用

`alemon.config.ts`

```ts
import { defineConfig } from 'alemonjs'
import icqq from 'alemon-icqq'
export default defineConfig({
  platforms: [icqq]
})
```

- 登录

`alemon.login.ts`

```ts
import { ALoginOptions } from 'alemonjs'
import { type IcqqLoginMap } from 'alemon-icqq'
export default ALoginOptions<IcqqLoginMap>({
  test: {
    icqq: {
      // 签名地址，请自行填写
      sign_api_addr: '',
      // 账号密码，请自行填写
      account: 0,
      // 密码，请自行填写
      password: ''
    }
  }
})
```

### 反馈

QQ group: 806943302
