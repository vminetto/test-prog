import { describe, expect, test } from 'vitest';

import { ContextCommand } from './../../../../src/commands/context/context.command';
import { CurrentContextCommand } from '../../../../src/commands/context/sub-commands/current/current.command';
import { DeleteContextCommand } from '../../../../src/commands/context/sub-commands/delete/delete.command';
import { ListContextCommand } from '../../../../src/commands/context/sub-commands/list/list.command';
import { NewContextCommand } from '../../../../src/commands/context/sub-commands/new/new.command';
import { UseContextCommand } from '../../../../src/commands/context/sub-commands/use/use.command';

type Sut = {
	sut: ContextCommand;
};

const makeSut = (): Sut => {
	const sut = new ContextCommand();

	return {
		sut,
	};
};

describe('ContextCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('context');
		expect(sut.alias).toBe('ctx');
		expect(sut.description).toBe('manage different environment contexts');
		expect(sut.subCommands).toEqual([
			CurrentContextCommand,
			DeleteContextCommand,
			ListContextCommand,
			NewContextCommand,
			UseContextCommand,
		]);
	});
});
