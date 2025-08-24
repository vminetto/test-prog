import env from '@config/env';

export default {
	knex: {
		client: 'pg',
		connection: {
			host: env.database.host,
			port: env.database.port,
			user: env.database.username,
			password: env.database.password,
			database: env.database.name,
		},
		pool: {
			min: 0,
			max: 2,
		},
	},
};
