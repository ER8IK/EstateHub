import { Router } from 'express';
import { investmentsController } from './investments.controller';
import { authMiddleware } from '../../shared/middleware';
const router = Router();
// POST /api/investments
router.post('/', authMiddleware, (req, res, next) => investmentsController.create(req, res, next));
// GET /api/investments
router.get('/', authMiddleware, (req, res, next) => investmentsController.getAll(req, res, next));
// GET /api/investments/:id
router.get('/:id', authMiddleware, (req, res, next) => investmentsController.getById(req, res, next));
// DELETE /api/investments/:id
router.delete('/:id', authMiddleware, (req, res, next) => investmentsController.delete(req, res, next));
export default router;
//# sourceMappingURL=investments.route.js.map