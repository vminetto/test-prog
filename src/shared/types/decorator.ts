export interface IDecorator {
	wrap(...args: unknown[]): unknown;
}
