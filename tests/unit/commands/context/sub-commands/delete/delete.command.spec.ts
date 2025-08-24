import { describe, expect, test } from 'vitest';

import { DeleteContextCommandAction } from '../../../../../../src/commands/context/sub-commands/delete/delete.action';
import { DeleteContextCommand } from '../../../../../../src/commands/context/sub-commands/delete/delete.command';

type Sut = {
	sut: DeleteContextCommand;
};

const makeSut = (): Sut => {
	const sut = new DeleteContextCommand();

	return {
		sut,
	};
};

describe('DeleteContextCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('delete');
		expect(sut.description).toBe('delete a context');
		expect(sut.options).toEqual([
			{
				flags: '-n, --name <string>',
				description: 'context name',
			},
		]);
		expect(sut.actionWrapper()).instanceOf(DeleteContextCommandAction);
	});
});
