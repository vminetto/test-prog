import { User } from '@core/user/user.model';
import { IRepository } from '@shared/types/repository';

export interface IUserRepository extends IRepository<User> {
	findByEmail(email: User['email']): Promise<User | undefined>;
}
