import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class AdminService {
  constructor(baseUrl = "/api/admin") {
    this.api = createApiClient(baseUrl);
  }

  async update(id, data) {
    return (await this.api.put(`/profile/${id}`, data, authHeader())).data;
  }

  async getAllReaders() {
    return (await this.api.get("/readers", authHeader())).data;
  }

  async getReaderById(id) {
    return (await this.api.get(`/readers/${id}`, authHeader())).data;
  }

  async updateReader(id, data) {
    return (await this.api.put(`/readers/${id}`, data, authHeader())).data;
  }

  async createReader(data) {
    return (await this.api.post("/readers", data, authHeader())).data;
  }

  async getAllStaffs() {
    return (await this.api.get("/staffs", authHeader())).data;
  }

  async getStaffById(id) {
    return (await this.api.get(`/staffs/${id}`, authHeader())).data;
  }

  async updateStaff(id, data) {
    return (await this.api.put(`/staffs/${id}`, data, authHeader())).data;
  }

  async createStaff(data) {
    return (await this.api.post("/staffs", data, authHeader())).data;
  }
}

export default new AdminService();
