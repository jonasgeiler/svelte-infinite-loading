/********************************************************************/
/*                        ESLint config file                        */
/* https://eslint.org/docs/latest/use/configure/configuration-files */
/********************************************************************/

import path from 'node:path';
import js from '@eslint/js';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

// TODO: Lint plain TypeScript files?
export default defineConfig([
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } }
	},

	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: {} }
	},

	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {}
	}
]);
