import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

const extensions = ['.js', '.ts', '.tsx'];

export default {
	input: 'src/index.ts', // entry point
	output: [
		{
			file: 'dist/index.cjs', // CommonJS build
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: 'dist/index.esm.js', // ESM build
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [
		resolve({ extensions }), // so Rollup can find node_modules
		commonjs(), // convert CJS → ESM if needed
		typescript({ tsconfig: './tsconfig.json' }),
		babel({
			extensions,
			babelHelpers: 'bundled',
			presets: ['@babel/preset-react'],
		}),
	],
	external: ['react', 'react-dom'], // don’t bundle React
};
