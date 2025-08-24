import { KnexJobRepository } from '@database/knex/repositories/job.repository';
import { ControllerDecorator } from '@shared/http/decorators/controller.decorator';
import { AuthMiddleware } from '@shared/http/middlewares/auth.middleware';
import { Router } from 'express';

import { ListJobsUseCase, RegisterJobUseCase, FindJobUseCase, ApplyJobUseCase } from '../usecases';
import { ListJobsController, RegisterJobController, FindJobController, ApplyJobController } from './controllers';

const router = Router();

const controller = new ControllerDecorator();
const repository = new KnexJobRepository();

router.get(
	'/jobs/search',
	AuthMiddleware,
	controller.wrap(() => {
		const useCase = new FindJobUseCase(repository);

		return new FindJobController(useCase);
	})
);

router.get(
	'/jobs',
	AuthMiddleware,
	controller.wrap(() => {
		const useCase = new ListJobsUseCase(repository);

		return new ListJobsController(useCase);
	})
);

router.post(
	'/job',
	AuthMiddleware,
	controller.wrap(() => {
		const useCase = new RegisterJobUseCase(repository);

		return new RegisterJobController(useCase);
	})
);

router.post(
	'/job/apply/:id',
	AuthMiddleware,
	controller.wrap(() => {
		const useCase = new ApplyJobUseCase(repository);

		return new ApplyJobController(useCase);
	})
);

export default router;
