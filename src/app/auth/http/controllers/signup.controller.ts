import { SignUpUseCase } from '@app/auth/usecases';
import { IController } from '@shared/types/controller';
import { Request, Response } from 'express';

export class SignUpController implements IController {
	constructor(private readonly signUpUseCase: SignUpUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const result = await this.signUpUseCase.run({
			name: request.body.name,
			email: request.body.email,
			password: request.body.password,
		});

		return response.status(201).json(result);
	}
}
