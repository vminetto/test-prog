import { IJobRepository, Job, JobDTO } from '@core/job';
import { IUseCase } from '@shared/types/usecase';
import Joi from 'joi';

export interface RegisterJobInput {
	title: string;
	description: string;
	ownerId: number;
}

export class RegisterJobUseCase implements IUseCase<RegisterJobInput, JobDTO> {
	constructor(private readonly jobRepository: IJobRepository) {}

	private rules = Joi.object<RegisterJobInput>({
		title: Joi.string().required(),
		description: Joi.string().required(),
		ownerId: Joi.number().required(),
	});

	async run(input: RegisterJobInput): Promise<JobDTO> {
		await this.rules.validateAsync(input);

		const newJob = Job.create(input);
		const job = await this.jobRepository.save(newJob);

		return job.toJson();
	}
}
