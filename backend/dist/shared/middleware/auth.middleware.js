import { verifyToken } from '../utils/jwt.utils';
import { AppError } from './error.middleware';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new AppError('No token provided', 401));
    }
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        return next(new AppError('Invalid token', 401));
    }
};
//# sourceMappingURL=auth.middleware.js.map