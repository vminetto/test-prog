export interface IRepository<T> {
	find(id: string | number): Promise<T | undefined>;
	get(...args: unknown[]): Promise<T[] | undefined>;
	save(data: T): Promise<T>;
}
