"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const error_middleware_1 = require("./error.middleware");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new error_middleware_1.AppError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new error_middleware_1.AppError('No token provided', 401));
    }
    try {
        const payload = (0, jwt_utils_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        return next(new error_middleware_1.AppError('Invalid token', 401));
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map