import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class BorrowService {
  constructor(baseUrl = "/api/borrows") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async getByUser(maDocGia) {
    return (await this.api.get(`/user/${maDocGia}`)).data;
  }

  async cancel(id) {
    return (await this.api.patch(`/${id}/cancel`)).data;
  }

  async getAll() {
    return (await this.api.get("/", authHeader())).data;
  }

  async updateStatus(id, data) {
    return (await this.api.put(`/${id}/status`, data, authHeader())).data;
  }
}

export default new BorrowService();
