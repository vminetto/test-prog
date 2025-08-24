import env from '@config/env';
import { NotAuthorizedError } from '@shared/errors';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const AuthMiddleware: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	const authorization = request.headers.authorization;

	if (!authorization) next(new NotAuthorizedError('Missing Authorization header'));

	const [schema, token] = authorization!.split(' ');

	if (schema !== 'Bearer' || !token) next(new NotAuthorizedError('Invalid Authorization format'));

	try {
		const payload = jwt.verify(token, env.jwt.secret) as {
			id: number;
			email: string;
		};

		request.user = {
			id: payload.id,
			email: payload.email,
		};
	} catch (error: unknown) {
		if (error instanceof TokenExpiredError) next(new NotAuthorizedError('Your session has expired'));
		if (error instanceof JsonWebTokenError) next(new NotAuthorizedError('You not authorized to proceed'));

		next(error);
	}

	next();
};
