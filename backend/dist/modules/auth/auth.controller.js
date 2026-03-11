import { authService } from './auth.service';
export class AuthController {
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
            const result = await authService.register(dto);
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
            const result = await authService.login(dto);
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
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map