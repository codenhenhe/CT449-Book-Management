import createApiClient from "./api.service";
import authHeader from "./auth-header.service";

class StaffService {
  constructor(baseUrl = "api/staff") {
    this.api = createApiClient(baseUrl);
  }

  // async getAllStaffs() {
  //   return (await this.api.get("/staffs", { headers: authHeader() })).data;
  // }

  async update(id, data) {
    return (await this.api.put(`/profile/${id}`, data, authHeader())).data;
  }
}

export default new StaffService();
