import { IJobRepository } from '@core/job';
import { IMessageOutput, IUseCase } from '@shared/types/usecase';
import Joi from 'joi';

export interface ApplyJobInput {
	jobId: number;
	userId: number;
}

export class ApplyJobUseCase implements IUseCase<ApplyJobInput, IMessageOutput> {
	constructor(private readonly jobRepository: IJobRepository) {}

	private rules = Joi.object<ApplyJobInput>({
		jobId: Joi.number().required(),
		userId: Joi.number().required(),
	});

	async run(input: ApplyJobInput): Promise<IMessageOutput> {
		await this.rules.validateAsync(input);
		await this.jobRepository.apply(input.jobId, input.userId);

		return {
			message: 'Job application successful!',
		};
	}
}
