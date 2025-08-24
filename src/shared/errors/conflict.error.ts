export class ConflictError extends Error {
	constructor(readonly message: string) {
		super(message);

		Object.setPrototypeOf(this, ConflictError.prototype);
	}
}
