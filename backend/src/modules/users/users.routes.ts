import {Router} from 'express';
import {UsersController} from './users.controller';
import {authMiddleware} from '../../shared/middleware';

const router = Router();
const usersController = new UsersController();

router.get('/', authMiddleware, (req, res, next) =>
  usersController.getAll(req, res, next)
);
router.get('/:id', authMiddleware, (req, res, next) =>
  usersController.getById(req, res, next)
);
router.get('/me', authMiddleware, (req, res, next) =>
  usersController.getMe(req, res, next)
);

export default router;