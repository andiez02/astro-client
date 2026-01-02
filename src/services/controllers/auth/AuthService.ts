import { AxiosInstance } from "axios";

const TOKEN_KEY = 'astro_access_token';

class AuthService {
    constructor(private apiClient: AxiosInstance) {}

    // Get nonce from backend
    async getNonce(address: string): Promise<string> {
        const res = await this.apiClient.get(`/auth/nonce?address=${address}`);
        return res?.data?.data?.nonce;
    }

    // Login with SIWE message and signature
    async login(message: string, signature: string): Promise<{ accessToken: string }> {
        const res = await this.apiClient.post(`/auth/login`, { message, signature });
        return res?.data?.data;
    }

    // Save token to localStorage
    saveToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    }

    // Get token from localStorage
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    }

    // Remove token from localStorage
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    }

    // Verify token with backend
    async verifyToken(): Promise<boolean> {
        const token = this.getToken();
        if (!token) return false;

        try {
            // Call backend to verify token
            // Backend returns: { valid: true } (wrapped by NestJS interceptor to { data: { valid: true } })
            const res = await this.apiClient.get('/auth/verify');
            // Handle both formats: { data: { valid: true } } or { valid: true }
            return res?.data?.data?.valid === true || res?.data?.valid === true;
        } catch (error) {
            // If verification fails, token is invalid
            console.error('Token verification failed:', error);
            return false;
        }
    }

    // Check if user is authenticated (synchronous - only checks local token existence and expiration)
    // Note: This does NOT verify token with backend. Use checkAuthAsync() for backend verification.
    checkAuth(): boolean {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            return !isExpired;
        } catch {
            // If not a valid JWT, just check if token exists
            return !!token;
        }
    }

    // Check if user is authenticated with backend verification (asynchronous)
    async checkAuthAsync(): Promise<boolean> {
        // First check locally for quick response
        if (!this.checkAuth()) {
            return false;
        }

        // Then verify with backend
        return await this.verifyToken();
    }
}   

export default AuthService;
