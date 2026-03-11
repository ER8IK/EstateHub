"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investments_controller_1 = require("./investments.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
// POST /api/investments
router.post('/', middleware_1.authMiddleware, (req, res, next) => investments_controller_1.investmentsController.create(req, res, next));
// GET /api/investments
router.get('/', middleware_1.authMiddleware, (req, res, next) => investments_controller_1.investmentsController.getAll(req, res, next));
// GET /api/investments/:id
router.get('/:id', middleware_1.authMiddleware, (req, res, next) => investments_controller_1.investmentsController.getById(req, res, next));
// DELETE /api/investments/:id
router.delete('/:id', middleware_1.authMiddleware, (req, res, next) => investments_controller_1.investmentsController.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=investments.route.js.map