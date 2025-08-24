import env from '@config/env';
import { ConflictError, ForbiddenError, NotFoundError, NotAuthorizedError } from '@shared/errors';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import Joi from 'joi';

interface ErrorResponse {
	error: any;
	debug?: unknown;
}

export const ErrorHandler: ErrorRequestHandler = async (
	error: Error,
	_request: Request,
	response: Response,
	_next: NextFunction
) => {
	const errorResponse = (error: Error, message?: string): ErrorResponse => ({
		error: message ?? error.message,
		debug: env.app.debug ? error.stack : null,
	});

	if (error instanceof NotFoundError) return response.status(404).json(errorResponse(error));
	if (error instanceof ConflictError) return response.status(409).json(errorResponse(error));
	if (error instanceof ForbiddenError) return response.status(403).json(errorResponse(error));
	if (error instanceof NotAuthorizedError) return response.status(401).json(errorResponse(error));
	if (error instanceof Joi.ValidationError) return response.status(422).json(errorResponse(error));

	return response.status(500).json(errorResponse(error, 'Internal server error'));
};
