"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const middleware_1 = require("../../shared/middleware");
const router = (0, express_1.Router)();
const usersController = new users_controller_1.UsersController();
router.get('/', middleware_1.authMiddleware, (req, res, next) => usersController.getAll(req, res, next));
router.get('/:id', middleware_1.authMiddleware, (req, res, next) => usersController.getById(req, res, next));
router.get('/me', middleware_1.authMiddleware, (req, res, next) => usersController.getMe(req, res, next));
exports.default = router;
//# sourceMappingURL=users.routes.js.map