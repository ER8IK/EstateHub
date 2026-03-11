import jwt from 'jsonwebtoken';
import { config} from '../../config/env';

export interface JwtPayload {
    userId: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwtSecret as string, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, config.jwtSecret as string) as JwtPayload;
}