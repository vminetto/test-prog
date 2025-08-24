import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('job', (table) => {
		table.increments('id');

		table.string('title');
		table.text('description');

		table.integer('ownerId').unsigned().index();
		table.foreign('ownerId').references('id').inTable('user');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('job');
}
