import dts from 'bun-plugin-dts'

await Bun.build({
  outdir: "dist",
  entrypoints: ["src/index.ts"],
  target: 'node',
  plugins: [
    dts()
  ]
})