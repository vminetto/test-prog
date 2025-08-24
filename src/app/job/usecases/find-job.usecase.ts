import { IJobRepository, JobDTO } from '@core/job';
import { NotFoundError } from '@shared/errors';
import { IUseCase } from '@shared/types/usecase';

export interface FindJobInput {
	title?: string;
}

export class FindJobUseCase implements IUseCase<FindJobInput, JobDTO[]> {
	constructor(private readonly jobRepository: IJobRepository) {}

	async run(input: FindJobInput): Promise<JobDTO[]> {
		const jobs = await this.jobRepository.get(input?.title);

		if (!jobs) {
			throw new NotFoundError('Jobs not found');
		}

		return jobs?.map((job) => job.toJson());
	}
}
