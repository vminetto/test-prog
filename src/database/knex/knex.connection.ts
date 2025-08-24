import database from '@config/database';
import { knex, type Knex } from 'knex';

export class KnexConnection {
	private static connection: Knex;

	private constructor() {}

	static getConnection(): Knex {
		if (!this.connection) {
			this.connection = knex(database.knex);
		}

		return this.connection;
	}
}
