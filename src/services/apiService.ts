import apiClient from "./apiClient";
import AuthService from "./controllers/auth/AuthService";

export class ApiService {
 public auth: AuthService;

 constructor() {
    this.auth = new AuthService(apiClient);
 }
}

export const api = new ApiService();