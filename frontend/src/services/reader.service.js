import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/reader") {
    this.api = createApiClient(baseUrl);
  }

  async update(id, data) {
    return (await this.api.put(`/profile/${id}`, data, authHeader())).data;
  }

  async create(data) {
    return (await this.api.post("/register", data)).data;
  }
}

export default new ReaderService();
