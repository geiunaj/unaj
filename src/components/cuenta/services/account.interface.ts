export interface ProfileRequest {
    name: string;
    email: string;
}

export interface PasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}