import env from '@config/env';
import { IUserRepository } from '@core/user';
import { NotAuthorizedError } from '@shared/errors';
import { IUseCase } from '@shared/types/usecase';
import hash from '@shared/utils/hash';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

export interface SignInInput {
	email: string;
	password: string;
}

export interface SignInOutput {
	accessToken: string;
}

export class SignInUseCase implements IUseCase<SignInInput, SignInOutput> {
	constructor(private readonly userRepository: IUserRepository) {}

	private rules = Joi.object<SignInInput>({
		email: Joi.string().email().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
	});

	async run(input: SignInInput): Promise<SignInOutput> {
		await this.rules.validateAsync(input);

		const user = await this.userRepository.findByEmail(input.email);

		if (!user) {
			throw new NotAuthorizedError('Invalid credentials');
		}

		const hasPasswordMatched = await hash.check(input.password, user.password!);

		if (!hasPasswordMatched) {
			throw new NotAuthorizedError('Invalid credentials');
		}

		const accessToken = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			env.jwt.secret,
			{
				expiresIn: '1h',
			}
		);

		return {
			accessToken,
		};
	}
}
