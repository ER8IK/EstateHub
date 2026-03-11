import { AppError } from '../../shared/middleware/error.middleware';
import { authService } from '../auth/auth.service';
export class UsersService {
    getAll() {
        const users = authService.getUsers();
        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        }));
    }
    getById(id) {
        const users = authService.getUsers();
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }
}
export const usersService = new UsersService();
//# sourceMappingURL=users.service.js.map