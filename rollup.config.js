import pluginTypescript from "@rollup/plugin-typescript"
import pluginNodeResolve from "@rollup/plugin-node-resolve"
import pluginCommonjs from "@rollup/plugin-commonjs"

const plugins = [
  pluginTypescript(),
  pluginCommonjs({
    extensions: [
      ".js",
      ".ts"
    ]
  }),
  pluginNodeResolve({
    browser: false,
  })
]

export default [
  {
    input: 'src/view-to-tsx.ts',
    output: [
      {
        name: 'view-to-tsx.js',
        format: 'iife',
        sourcemap: 'inline'
      },
    ],
    plugins
  },
  {
    input: 'src/ejs-to-tsx.ts',
    output: [
      {
        name: 'ejs-to-tsx.js',
        format: 'iife',
        sourcemap: 'inline'
      },
    ],
    plugins
  },
]
