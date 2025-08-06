import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async create(data) {
    return (await this.api.post("/add", data, authHeader())).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`, authHeader())).data;
  }

  async getById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data, authHeader())).data;
  }
}

export default new BookService();
