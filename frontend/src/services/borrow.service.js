import createApiClient from "./api.service";
// import authHeader from "./auth-header.service";

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
}

export default new BorrowService();
