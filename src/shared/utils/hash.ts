import env from '@config/env';
import bcrypt from 'bcrypt';

async function make(value: string): Promise<string> {
	return bcrypt.hash(value, env.bcrypt.rounds);
}

async function check(value: string, hashed: string): Promise<boolean> {
	return bcrypt.compare(value, hashed);
}

export default {
	make,
	check,
};
