export class NotFoundError extends Error {
	constructor(readonly message: string) {
		super(message);

		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}
