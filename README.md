## Alemon-Icqq

> AlemonJS @1.2.0-rc.20 -- @latest

```sh
npm i alemon-icqq
```

`alemon.login.ts`

```ts
import { ALoginOptions } from 'alemonjs'
import { type IcqqLoginMap } from 'alemon-icqq'
export default ALoginOptions<IcqqLoginMap>({
  test: {
    icqq: {
      sign_api_addr: '',
      account: 0,
      password: ''
    }
  }
})
```

`alemon.config.ts`

```ts
import { defineConfig } from 'alemonjs'
import icqq from 'alemon-icqq'
export default defineConfig({
  platforms: [icqq]
})
```
