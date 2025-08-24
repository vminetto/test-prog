import { IController } from '@shared/types/controller';
import { IDecorator } from '@shared/types/decorator';
import { Request, RequestHandler, Response } from 'express';

export class ControllerDecorator implements IDecorator {
	wrap(controller: IController | (() => IController)): RequestHandler {
		const _controller = typeof controller === 'function' ? controller() : controller;

		return async (request: Request, response: Response) => _controller.handle(request, response);
	}
}
