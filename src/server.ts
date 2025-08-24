import env from '@config/env';
import api from '@routes/api';
import { ErrorHandler } from '@shared/http/middlewares/errors.middleware';
import logger from '@shared/utils/logger';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(api);
app.use(ErrorHandler);

app.listen(env.app.port, (error) => {
	if (error) {
		logger.error('App :: Error on running application server');
		logger.error(`App :: Error message: ${error.message}`);
		return;
	}

	logger.info(`App :: Running on port: ${env.app.port}`);
});
