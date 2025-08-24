import { type Knex } from 'knex';

import { KnexConnection } from './knex.connection';

export abstract class KnexRepository {
	protected db: Knex;

	constructor() {
		this.db = KnexConnection.getConnection();
	}
}
