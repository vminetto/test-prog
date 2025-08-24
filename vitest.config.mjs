import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		dir: 'tests',
		watch: false,
		reporters: ['verbose'],
	},
	plugins: [tsconfigPaths()],
});
