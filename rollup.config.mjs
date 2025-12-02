import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: Object.fromEntries(
		globSync('src/js/**/*.js').map(file => [
			// This removes `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				'src/js',
				file.slice(0, file.length - path.extname(file).length)
			),
			// This expands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
  output: {
    dir: 'modules/common-styling/public/assets/js/',
    plugins: [
      terser()
    ]
  },
  plugins: [
    nodeResolve(),
    json(),
    commonjs({
      include: /node_modules/,
    })
  ],
  treeshake: false
};