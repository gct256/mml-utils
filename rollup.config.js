import commonjs from 'rollup-plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';

import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const base = {
  input: './src/index.ts',
  plugins: [
    commonjs({
      namedExports: {
        'src/parse/pegParser/pegParser.js': ['SyntaxError']
      }
    }),
    typescript2({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: './types'
        },
        include: ['./src/index.ts', './src/missing.d.ts'],
        exclude: ['./node_modules/**/*.*']
      },
      useTsconfigDeclarationDir: true
    })
  ],
  external: ['fraction.js', 'chalk']
};

const targets = [
  {
    ...base,
    output: {
      file: './lib/index.js',
      format: 'cjs'
    }
  }
];

if (isProduction) {
  targets.push({
    ...base,
    output: {
      file: './lib/index.mjs',
      format: 'es'
    }
  });
}

export default targets;
