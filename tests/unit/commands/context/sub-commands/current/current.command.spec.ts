import { describe, expect, test } from 'vitest';

import { CurrentContextCommandAction } from '../../../../../../src/commands/context/sub-commands/current/current.action';
import { CurrentContextCommand } from '../../../../../../src/commands/context/sub-commands/current/current.command';

type Sut = {
	sut: CurrentContextCommand;
};

const makeSut = (): Sut => {
	const sut = new CurrentContextCommand();

	return {
		sut,
	};
};

describe('CurrentContextCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('current');
		expect(sut.description).toBe('show current context');
		expect(sut.actionWrapper()).instanceOf(CurrentContextCommandAction);
	});
});
