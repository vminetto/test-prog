import { IJobRepository, JobDTO } from '@core/job';
import { NotFoundError } from '@shared/errors';
import { IUseCase } from '@shared/types/usecase';
import Joi from 'joi';

export interface ListJobsInput {
	ownerId: number;
}

export class ListJobsUseCase implements IUseCase<ListJobsInput, JobDTO[]> {
	constructor(private readonly jobRepository: IJobRepository) {}

	private rules = Joi.object<ListJobsInput>({
		ownerId: Joi.number().required(),
	});

	async run(input: ListJobsInput): Promise<JobDTO[]> {
		await this.rules.validateAsync(input);

		const jobs = await this.jobRepository.getByOwner(input.ownerId);

		if (!jobs) {
			throw new NotFoundError('Jobs not found');
		}

		return jobs?.map((job) => job.toJson());
	}
}
