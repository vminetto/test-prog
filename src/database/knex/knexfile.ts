import { resolve } from 'node:path';

import database from '@config/database';
import { type Knex } from 'knex';

export default {
	...database.knex,
	migrations: {
		directory: resolve(__dirname, 'migrations'),
	},
	seeds: {
		directory: resolve(__dirname, 'seeders'),
	},
} as Knex.Config;
