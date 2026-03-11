"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.UsersService = void 0;
const error_middleware_1 = require("../../shared/middleware/error.middleware");
const auth_service_1 = require("../auth/auth.service");
class UsersService {
    getAll() {
        const users = auth_service_1.authService.getUsers();
        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        }));
    }
    getById(id) {
        const users = auth_service_1.authService.getUsers();
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }
}
exports.UsersService = UsersService;
exports.usersService = new UsersService();
//# sourceMappingURL=users.service.js.map