"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const hash_utils_1 = require("../../shared/utils/hash.utils");
const jwt_utils_1 = require("../../shared/utils/jwt.utils");
const id_utils_1 = require("../../shared/utils/id.utils");
const error_middleware_1 = require("../../shared/middleware/error.middleware");
const users = [];
class AuthService {
    async register(dto) {
        const exists = users.find(u => u.email === dto.email);
        if (exists) {
            throw new error_middleware_1.AppError('Email already in use', 409);
        }
        const hashedPassword = await (0, hash_utils_1.hashPassword)(dto.password);
        const user = {
            id: (0, id_utils_1.generateId)(),
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            createdAt: new Date(),
        };
        users.push(user);
        const token = (0, jwt_utils_1.generateToken)({ userId: user.id, email: user.email });
        const userPublic = {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
        return { user: userPublic, token };
    }
    async login(dto) {
        const user = users.find(u => u.email === dto.email);
        if (!user) {
            throw new error_middleware_1.AppError('Invalid email or password', 401);
        }
        const isValid = await (0, hash_utils_1.comparePasswords)(dto.password, user.password);
        if (!isValid) {
            throw new error_middleware_1.AppError('Invalid email or password', 401);
        }
        const token = (0, jwt_utils_1.generateToken)({ userId: user.id, email: user.email });
        const userPublic = {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
        return { user: userPublic, token };
    }
    getUsers() {
        return users;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map