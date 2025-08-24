import { IUserRepository, User } from '@core/user';

import { KnexRepository } from '../knex.repository';

export class KnexUserRepository extends KnexRepository implements IUserRepository {
	constructor() {
		super();
	}

	find(_id: string | number): Promise<User | undefined> {
		throw new Error('Method not implemented.');
	}
	get(): Promise<User[] | undefined> {
		throw new Error('Method not implemented.');
	}

	async save(data: User): Promise<User> {
		const [{ id }] = await this.db('user')
			.insert({
				name: data.name,
				email: data.email,
				password: data.password,
			})
			.returning('id');

		return User.fromPayload({
			...data,
			id,
		});
	}

	async findByEmail(email: User['email']): Promise<User | undefined> {
		const result = await this.db('user').where({ email }).first();

		if (!result) return;

		return User.fromPayload(result);
	}
}
