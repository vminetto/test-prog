import { UserDTO, IUserRepository, User } from '@core/user';
import { ConflictError } from '@shared/errors';
import { IUseCase } from '@shared/types/usecase';
import hash from '@shared/utils/hash';
import Joi from 'joi';

export interface SignUpInput {
	name: string;
	email: string;
	password: string;
}

export class SignUpUseCase implements IUseCase<SignUpInput, UserDTO> {
	constructor(private readonly userRepository: IUserRepository) {}

	private rules = Joi.object<SignUpInput>({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
	});

	async run(input: SignUpInput): Promise<UserDTO> {
		await this.rules.validateAsync(input);

		const isUserExists = !!(await this.userRepository.findByEmail(input.email));

		if (isUserExists) {
			throw new ConflictError('This user is already registered.');
		}

		const newUser = User.create({
			name: input.name,
			email: input.email,
			password: await hash.make(input.password),
		});

		const user = await this.userRepository.save(newUser);

		return user.toJson();
	}
}
