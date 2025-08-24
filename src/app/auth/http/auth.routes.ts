import { KnexUserRepository } from '@database/knex/repositories/user.repository';
import { ControllerDecorator } from '@shared/http/decorators/controller.decorator';
import { Router } from 'express';

import { SignInUseCase, SignUpUseCase } from '../usecases';
import { SignInController, SignUpController } from './controllers';

const router = Router();

const controller = new ControllerDecorator();
const repository = new KnexUserRepository();

router.post(
	'/auth/signin',
	controller.wrap(() => {
		const useCase = new SignInUseCase(repository);

		return new SignInController(useCase);
	})
);

router.post(
	'/auth/signup',
	controller.wrap(() => {
		const useCase = new SignUpUseCase(repository);

		return new SignUpController(useCase);
	})
);

export default router;
