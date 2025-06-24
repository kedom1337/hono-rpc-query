import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  exports: true,
  sourcemap: true,
  dts: {
    sourcemap: true,
  },
})
