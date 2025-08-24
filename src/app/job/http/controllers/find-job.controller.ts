import { FindJobUseCase } from '@app/job/usecases';
import { IController } from '@shared/types/controller';
import { Request, Response } from 'express';

export class FindJobController implements IController {
	constructor(private readonly findJobUseCase: FindJobUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const result = await this.findJobUseCase.run({
			title: request.query?.title as string,
		});

		return response.status(200).json(result);
	}
}
