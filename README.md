## Alemon-Icqq

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
      //
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
