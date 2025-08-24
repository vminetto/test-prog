import { IJobRepository, Job } from '@core/job';
import { User } from '@core/user';

import { KnexRepository } from '../knex.repository';

export class KnexJobRepository extends KnexRepository implements IJobRepository {
	constructor() {
		super();
	}

	async find(id: string | number): Promise<Job | undefined> {
		const result = await this.db('job').where({ id }).first();

		if (!result) return;

		return Job.fromPayload(result);
	}

	async get(title?: Job['title']): Promise<Job[] | undefined> {
		const result = await this.db('job').where('title', 'ilike', `%${title}%`);

		if (!result) return;

		return result.map((job) => Job.fromPayload(job));
	}

	async getByOwner(ownerId: Job['ownerId']): Promise<Job[] | undefined> {
		const result = await this.db('job').where({
			ownerId,
		});

		if (!result) return;

		return result.map((job) => Job.fromPayload(job));
	}

	async save(data: Job): Promise<Job> {
		const [{ id }] = await this.db('job')
			.insert({
				title: data.title,
				description: data.description,
				ownerId: data.ownerId,
			})
			.returning('id');

		return Job.fromPayload({
			...data,
			id,
		});
	}

	async apply(jobId: Job['id'], userId: User['id']): Promise<boolean> {
		const [{ id }] = await this.db('job_applicants')
			.insert({
				jobId,
				userId,
			})
			.returning('id');

		return !!id;
	}
}
