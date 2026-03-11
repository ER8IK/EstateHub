import { RegisterDto, LoginDto, UserPublic } from '../../shared/types';
import { User } from '../../shared/types';
export declare class AuthService {
    register(dto: RegisterDto): Promise<{
        user: UserPublic;
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: UserPublic;
        token: string;
    }>;
    getUsers(): User[];
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map