import { SignInUseCase } from '@app/auth/usecases';
import { IController } from '@shared/types/controller';
import { Request, Response } from 'express';

export class SignInController implements IController {
	constructor(private readonly signInUseCase: SignInUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const result = await this.signInUseCase.run({
			email: request.body.email,
			password: request.body.password,
		});

		return response.status(200).json(result);
	}
}
