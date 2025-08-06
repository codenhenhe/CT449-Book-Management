<template>
  <div class="container mt-5">
    <h2 class="mb-4">Đăng nhập</h2>
    <LoginForm @submit="handleLogin" />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import authService from "@/services/auth.service";

export default {
  components: { LoginForm },
  methods: {
    async handleLogin(credentials) {
      try {
        const res = await authService.login(credentials);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        // chuyển hướng đến dashboard theo vai trò
        switch (res.user.vaiTro) {
          case "admin":
            this.$router.push({ name: "admin.dashboard" });
            break;
          case "staff":
            this.$router.push({ name: "staff.dashboard" });
            break;
          case "reader":
            this.$router.push({ name: "reader.dashboard" });
            break;
          default:
            this.$router.push("/");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Đăng nhập thất bại.");
      }
    },
  },
};
</script>
