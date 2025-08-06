import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class AuthorService {
  constructor(baseUrl = "/api/authors") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/", authHeader())).data;
  }

  async create(data) {
    return (await this.api.post("/", data, authHeader())).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data, authHeader())).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`, authHeader())).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}

export default new AuthorService();
