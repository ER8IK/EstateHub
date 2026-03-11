import { Router } from 'express';
import { propertiesController } from './properties.controller';
import { authMiddleware } from '../../shared/middleware';
const router = Router();
router.get('/public', (req, res, next) => propertiesController.getPublic(req, res, next));
router.get('/public/:id', (req, res, next) => propertiesController.getByIdPublic(req, res, next));
router.post('/', authMiddleware, (req, res, next) => propertiesController.create(req, res, next));
router.get('/', authMiddleware, (req, res, next) => propertiesController.getAll(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => propertiesController.getById(req, res, next));
router.patch('/:id', authMiddleware, (req, res, next) => propertiesController.update(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => propertiesController.delete(req, res, next));
export default router;
//# sourceMappingURL=properties.route.js.map