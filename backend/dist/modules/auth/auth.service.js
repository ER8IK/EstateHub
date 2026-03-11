import { hashPassword, comparePasswords } from '../../shared/utils/hash.utils';
import { generateToken } from '../../shared/utils/jwt.utils';
import { generateId } from '../../shared/utils/id.utils';
import { AppError } from '../../shared/middleware/error.middleware';
const users = [];
export class AuthService {
    async register(dto) {
        const exists = users.find(u => u.email === dto.email);
        if (exists) {
            throw new AppError('Email already in use', 409);
        }
        const hashedPassword = await hashPassword(dto.password);
        const user = {
            id: generateId(),
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            createdAt: new Date(),
        };
        users.push(user);
        const token = generateToken({ userId: user.id, email: user.email });
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
            throw new AppError('Invalid email or password', 401);
        }
        const isValid = await comparePasswords(dto.password, user.password);
        if (!isValid) {
            throw new AppError('Invalid email or password', 401);
        }
        const token = generateToken({ userId: user.id, email: user.email });
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
export const authService = new AuthService();
//# sourceMappingURL=auth.service.js.map