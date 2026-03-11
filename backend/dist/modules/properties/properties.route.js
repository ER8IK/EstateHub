"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const properties_controller_1 = require("./properties.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
router.get('/public', (req, res, next) => properties_controller_1.propertiesController.getPublic(req, res, next));
router.get('/public/:id', (req, res, next) => properties_controller_1.propertiesController.getByIdPublic(req, res, next));
router.post('/', middleware_1.authMiddleware, (req, res, next) => properties_controller_1.propertiesController.create(req, res, next));
router.get('/', middleware_1.authMiddleware, (req, res, next) => properties_controller_1.propertiesController.getAll(req, res, next));
router.get('/:id', middleware_1.authMiddleware, (req, res, next) => properties_controller_1.propertiesController.getById(req, res, next));
router.patch('/:id', middleware_1.authMiddleware, (req, res, next) => properties_controller_1.propertiesController.update(req, res, next));
router.delete('/:id', middleware_1.authMiddleware, (req, res, next) => properties_controller_1.propertiesController.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=properties.route.js.map