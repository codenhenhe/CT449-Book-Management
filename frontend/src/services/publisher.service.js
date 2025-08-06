import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class PublisherService {
  constructor(baseUrl = "/api/publishers") {
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

  async getById(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}

export default new PublisherService();
