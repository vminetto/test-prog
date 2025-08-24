import { describe, expect, test } from 'vitest';

import { ConfigCommandAction } from '../../../../src/commands/config/config.action';
import { ConfigCommand } from './../../../../src/commands/config/config.command';

type Sut = {
	sut: ConfigCommand;
};

const makeSut = (): Sut => {
	const sut = new ConfigCommand();

	return {
		sut,
	};
};

describe('ConfigCommand', () => {
	test('should be defined properties', () => {
		const { sut } = makeSut();

		expect(sut.name).toBe('config');
		expect(sut.description).toBe('configure environment');
		expect(sut.options).toEqual([
			{
				flags: '--url <url>',
				description: 'environment URL',
			},
			{
				flags: '-t, --tenant <string>',
				description: 'tenant name',
			},
			{
				flags: '-u, --client-id <string>',
				description: 'keycloak clientId',
			},
			{
				flags: '-s, --client-secret <string>',
				description: 'keycloak clientSecret',
			},
		]);

		expect(sut.actionWrapper()).toBeInstanceOf(ConfigCommandAction);
	});
});
