export interface IUseCase<I = unknown, O = unknown> {
	run(input: I): Promise<O>;
}

export interface IMessageOutput {
	message: string;
}
