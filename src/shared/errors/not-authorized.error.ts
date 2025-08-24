export class NotAuthorizedError extends Error {
	constructor(readonly message: string) {
		super(message);

		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}
}
