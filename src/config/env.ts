import { resolve } from 'node:path';

import { config } from 'dotenv';
import env from 'env-var';

config({
	path: resolve(__dirname, '..', '..', '.env'),
});

export default {
	app: {
		port: env.get('APP_PORT').default(8000).asString(),
		debug: env.get('APP_DEBUG').default('true').asBool(),
	},
	database: {
		host: env.get('DB_HOST').default('127.0.0.1').asString(),
		port: env.get('DB_PORT').default(5432).asPortNumber(),
		name: env.get('DB_NAME').default('postgres').asString(),
		username: env.get('DB_USERNAME').default('postgres').asString(),
		password: env.get('DB_PASSWORD').required().asString(),
	},
	bcrypt: {
		rounds: env.get('BCRYPT_ROUNDS').default(12).asInt(),
	},
	jwt: {
		secret: env.get('JWT_SECRET').required().asString(),
	},
};
