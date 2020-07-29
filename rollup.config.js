import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default [
	// tests
	{
		input:   'test/src/index.js',
		output:  {
			file:   'test/public/bundle.js',
			format: 'iife',
		},
		plugins: [
			resolve(),
			commonjs(),
			svelte()
		],
	},
];