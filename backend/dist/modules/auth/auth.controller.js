"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            const dto = req.body;
            if (!dto.email || !dto.password || !dto.name) {
                res.status(400).json({
                    success: false,
                    message: 'Email, password and name are required',
                });
                return;
            }
            const result = await auth_service_1.authService.register(dto);
            res.status(201).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const dto = req.body;
            if (!dto.email || !dto.password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required',
                });
                return;
            }
            const result = await auth_service_1.authService.login(dto);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map