import { ListJobsUseCase } from '@app/job/usecases';
import { IController } from '@shared/types/controller';
import { Request, Response } from 'express';

export class ListJobsController implements IController {
	constructor(private readonly listJobsUseCase: ListJobsUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const result = await this.listJobsUseCase.run({
			ownerId: request.user!.id,
		});

		return response.status(200).json(result);
	}
}
