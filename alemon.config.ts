import { defineConfig } from 'alemonjs'
import icqq from './src/index.js'
export default defineConfig({
  app: {
    scripts: 'main.ts'
  },
  platforms: [icqq]
})
