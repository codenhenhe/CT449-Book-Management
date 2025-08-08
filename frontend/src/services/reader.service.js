import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class ReaderService {
  constructor(baseUrl = "/api/reader") {
    this.api = createApiClient(baseUrl);
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data, authHeader())).data;
  }

  async create(data) {
    return (await this.api.post("/register", data)).data;
  }
}

export default new ReaderService();
