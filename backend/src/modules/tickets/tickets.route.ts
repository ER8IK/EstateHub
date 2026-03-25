import { Router } from 'express';
import { ticketsController } from './tickets.controller';
import { authMiddleware } from '../../shared/middleware';

const router: Router = Router();

router.post('/', authMiddleware, (req, res, next) =>
  ticketsController.create(req, res, next)
);

export default router;