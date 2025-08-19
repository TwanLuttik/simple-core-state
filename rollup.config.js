import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

export default [
	// JS bundles
	{
		input: 'src/index.ts',
		output: [
			{ file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
			{ file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
		],
		plugins: [
			resolve({ extensions: ['.js', '.ts', '.tsx'] }),
			commonjs(),
			typescript({ tsconfig: './tsconfig.json', declaration: false }),
			babel({ extensions: ['.js', '.ts', '.tsx'], babelHelpers: 'bundled', presets: ['@babel/preset-react'] }),
		],
		external: ['react', 'react-dom'],
	},

	// Types
	{
		input: 'src/index.ts',
		output: { file: 'dist/index.d.ts', format: 'es' },
		plugins: [dts()],
	},
];
