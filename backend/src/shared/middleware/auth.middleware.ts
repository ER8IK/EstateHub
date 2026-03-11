import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.utils';
import { AppError } from './error.middleware';
import { verify } from 'node:crypto';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
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
    } catch {
        return next(new AppError('Invalid token', 401));
    }
};  