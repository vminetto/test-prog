import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node },
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		ignores: ['node_modules', 'dist'],
	},
	tseslint.configs.recommended,
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
	importPlugin.flatConfigs.recommended,
	{
		rules: {
			// typescript
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			// import
			'import/no-unresolved': 'off',
			'import/order': [
				'error',
				{
					'groups': ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
					'newlines-between': 'always',
					'alphabetize': {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
		},
	},
]);
