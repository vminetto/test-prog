import * as log4js from 'log4js';

log4js.configure({
	appenders: {
		console: { type: 'console' },
	},
	categories: { default: { appenders: ['console'], level: 'debug' } },
});

const logger = log4js.getLogger();

export default logger;
