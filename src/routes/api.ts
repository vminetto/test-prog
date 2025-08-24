import AuthRoutes from '@app/auth/http/auth.routes';
import JobRoutes from '@app/job/http/job.routes';
import { Router } from 'express';

const router = Router();

router.use('/api', [AuthRoutes, JobRoutes]);

export default router;
