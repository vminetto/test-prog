export interface UserDTO {
	name: User['name'];
	email: User['email'];
	password?: User['password'];
	id?: User['id'];
}

export class User {
	private constructor(
		readonly name: string,
		readonly email: string,
		readonly password?: string,
		readonly id?: number
	) {}

	static create(data: Required<Pick<UserDTO, 'email' | 'name' | 'password'>>): User {
		return this.fromPayload(data);
	}

	static fromPayload(data: UserDTO): User {
		return new User(data.name, data.email, data?.password, data?.id);
	}

	toJson(): UserDTO {
		return {
			id: this.id,
			email: this.email,
			name: this.name,
		};
	}
}
