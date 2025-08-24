import { User } from '@core/user';
import { IRepository } from '@shared/types/repository';

import { Job } from './job.model';

export interface IJobRepository extends IRepository<Job> {
	get(title?: Job['title']): Promise<Job[] | undefined>;
	getByOwner(ownerId: Job['ownerId']): Promise<Job[] | undefined>;
	apply(jobId: Job['id'], userId: User['id']): Promise<boolean>;
}
