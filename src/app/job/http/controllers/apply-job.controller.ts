import { ApplyJobUseCase } from '@app/job/usecases';
import { IController } from '@shared/types/controller';
import { Request, Response } from 'express';

export class ApplyJobController implements IController {
	constructor(private readonly findJobUseCase: ApplyJobUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const result = await this.findJobUseCase.run({
			jobId: parseInt(request.params?.id),
			userId: request.user!.id,
		});

		return response.status(201).json(result);
	}
}
