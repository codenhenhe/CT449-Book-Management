import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class AuthService {
  constructor(baseUrl = "/api") {
    this.api = createApiClient(baseUrl);
  }

  async login(credentials) {
    return (await this.api.post("/login", credentials)).data;
  }

  async changePassword(data) {
    return (await this.api.put("/password/change-password", data, authHeader()))
      .data;
  }

  async resetPassword(token, data) {
    return (await this.api.put(`/password/reset-password/${token}`, data)).data;
  }

  async forgotPassword(payload) {
    return (await this.api.post("/password/forgot-password", payload)).data;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
