import { describe, expect, test } from 'vitest';

import { UseContextCommandAction } from '../../../../../../src/commands/context/sub-commands/use/use.action';
import { UseContextCommand } from '../../../../../../src/commands/context/sub-commands/use/use.command';

type Sut = {
	sut: UseContextCommand;
};

const makeSut = (): Sut => {
	const sut = new UseContextCommand();

	return {
		sut,
	};
};

describe('UseContextCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('use');
		expect(sut.description).toBe('switch to a different context');
		expect(sut.options).toEqual([
			{
				flags: '-n, --name <string>',
				description: 'context name',
			},
		]);
		expect(sut.actionWrapper()).instanceOf(UseContextCommandAction);
	});
});
