import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api") {
    this.api = createApiClient(baseUrl);
  }

  async login(credentials) {
    return (await this.api.post("/login", credentials)).data;
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
