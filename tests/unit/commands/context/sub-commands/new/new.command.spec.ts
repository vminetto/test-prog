import { describe, expect, test } from 'vitest';

import { NewContextCommandAction } from '../../../../../../src/commands/context/sub-commands/new/new.action';
import { NewContextCommand } from '../../../../../../src/commands/context/sub-commands/new/new.command';

type Sut = {
	sut: NewContextCommand;
};

const makeSut = (): Sut => {
	const sut = new NewContextCommand();

	return {
		sut,
	};
};

describe('NewContextCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('new');
		expect(sut.description).toBe('create a new context');
		expect(sut.options).toEqual([
			{
				flags: '-n, --name <string>',
				description: 'context name',
			},
		]);
		expect(sut.actionWrapper()).instanceOf(NewContextCommandAction);
	});
});
