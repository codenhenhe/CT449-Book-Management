import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    vaiTroHienThi: (state) => {
      const role = state.user?.vaiTro;
      return (
        {
          quantrivien: "Quản trị viên",
          nhanvien: "Nhân viên",
          docgia: "Đọc giả",
        }[role] || ""
      );
    },
    profileLink: (state) => {
      switch (state.user?.vaiTro) {
        case "quantrivien":
          return "/admin/profile";
        case "nhanvien":
          return "/staff/profile";
        case "docgia":
          return "/reader/profile";
        default:
          return "/";
      }
    },
  },
  actions: {
    login(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
