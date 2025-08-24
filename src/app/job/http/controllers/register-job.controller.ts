import { RegisterJobUseCase } from '@app/job/usecases';
import { IController } from '@shared/types/controller';
import { Request, Response } from 'express';

export class RegisterJobController implements IController {
	constructor(private readonly registerJobUseCase: RegisterJobUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const result = await this.registerJobUseCase.run({
			title: request.body.title,
			description: request.body.description,
			ownerId: request.user!.id,
		});

		return response.status(201).json(result);
	}
}
