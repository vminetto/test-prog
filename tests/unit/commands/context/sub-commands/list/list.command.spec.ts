import { describe, expect, test } from 'vitest';

import { ListContextCommandAction } from '../../../../../../src/commands/context/sub-commands/list/list.action';
import { ListContextCommand } from '../../../../../../src/commands/context/sub-commands/list/list.command';

type Sut = {
	sut: ListContextCommand;
};

const makeSut = (): Sut => {
	const sut = new ListContextCommand();

	return {
		sut,
	};
};

describe('ListContextCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('list');
		expect(sut.description).toBe('list all contexts');
		expect(sut.actionWrapper()).instanceOf(ListContextCommandAction);
	});
});
