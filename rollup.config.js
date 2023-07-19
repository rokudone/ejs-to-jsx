import typescript from "@rollup/plugin-typescript"
import nodeResolve from "@rollup/plugin-node-resolve"
import commonJS from "@rollup/plugin-commonjs"
import inject from '@rollup/plugin-inject'


const buildConfig = (input) => {
  return {
    input: `src/${input}.ts`,
    external: ['sparser'],
    output: {
      dir: './dist/',
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
];
