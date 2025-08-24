import { Response, Request } from 'express';

export interface IController {
	handle(request: Request, response: Response): Promise<Response>;
}
