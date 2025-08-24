import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('user', (table) => {
		table.increments('id');

		table.string('name');
		table.string('email').unique();
		table.string('password');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('user');
}
