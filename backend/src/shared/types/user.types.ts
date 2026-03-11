export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
}

export interface UserPublic {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}