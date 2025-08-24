import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('job_applicants', (table) => {
		table.increments('id');

		table.integer('jobId').unsigned().index();
		table.foreign('jobId').references('id').inTable('job');

		table.integer('userId').unsigned().index();
		table.foreign('userId').references('id').inTable('user');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('job_applicants');
}
