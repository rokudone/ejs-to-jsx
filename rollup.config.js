import typescript from "@rollup/plugin-typescript"
import nodeResolve from "@rollup/plugin-node-resolve"
import commonJS from "@rollup/plugin-commonjs"
import inject from '@rollup/plugin-inject'


const buildConfig = (input) => {
  return {
    input: `src/${input}/index.ts`,
    external: ['sparser'],
    output: {
      file: `dist/${input}.js`,
      format: 'es',
      sourcemap: 'false',
      interop: 'defaultOnly',
      globals: {
        'sparser': 'sparser',
      }
    },
    plugins: [
      typescript({
        declaration: false,
      }),
      nodeResolve({preferBuiltins: true}),
      commonJS(),
      inject({
        'sparser': 'sparser'
      }),
    ]
  }
}

export default [
  buildConfig('ejs-to-jsx'),
  buildConfig('jsx-to-component'),
];
