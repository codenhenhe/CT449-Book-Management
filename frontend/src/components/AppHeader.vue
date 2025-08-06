<template>
  <header
    class="bg-dark text-white d-flex justify-content-between align-items-center px-4 py-2 shadow-sm"
  >
    <!-- Logo -->
    <div
      class="d-flex align-items-center ml-4"
      style="cursor: pointer"
      @click="goHome"
    >
      <img src="../assets/favicon.png" alt="Logo" id="logo" />
      <h5 class="mb-0 ml-2">Thư viện nhỏ</h5>
    </div>

    <!-- Thời gian -->
    <div class="text-center fs-5 d-none d-md-block">
      <div>{{ currentTime }}</div>
      <small class="text-muted">Bây giờ</small>
    </div>

    <!-- Người dùng -->
    <div class="d-flex align-items-center mr-4">
      <!-- Nếu đã đăng nhập -->
      <template v-if="auth.isLoggedIn && auth.user">
        <router-link
          :to="profileLink"
          class="d-flex align-items-center text-white text-decoration-none user-link mr-3"
        >
          <div class="text-end mr-2">
            <div>{{ auth.user.hoLot }} {{ auth.user.ten }}</div>
            <small class="text-muted fst-italic">{{ vaiTroHienThi }}</small>
          </div>
          <img
            src="../assets/user.png"
            class="rounded-circle user-avatar"
            alt="User Avatar"
          />
        </router-link>

        <button
          class="btn btn-outline-light btn-sm d-flex align-items-center"
          @click="handleLogout"
        >
          <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
        </button>
      </template>

      <!-- Nếu chưa đăng nhập -->
      <template v-else>
        <router-link to="/login" class="btn btn-outline-light btn-sm mr-2">
          Đăng nhập
        </router-link>
        <router-link to="/register" class="btn btn-light btn-sm text-dark">
          Đăng ký
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

// Thời gian thực
const currentTime = ref("");

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("vi-VN");
}

let timer;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});
onUnmounted(() => clearInterval(timer));

// Vai trò
const vaiTroHienThi = computed(() => {
  const role = auth.user?.vaiTro;
  return (
    {
      quantrivien: "Quản trị viên",
      nhanvien: "Nhân viên",
      docgia: "Đọc giả",
    }[role] || ""
  );
});

// Link đến trang cá nhân
const profileLink = computed(() => {
  switch (auth.user?.vaiTro) {
    case "quantrivien":
      return "/admin/profile";
    case "nhanvien":
      return "/staff/profile";
    case "docgia":
      return "/reader/profile";
    default:
      return "/";
  }
});

// Sự kiện
function goHome() {
  router.push("/books");
}
function handleLogout() {
  auth.logout();
  router.replace({ name: "login" });
}
</script>

<style scoped>
#logo {
  height: 40px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  transition: transform 0.2s ease;
}

.user-link:hover .user-avatar {
  transform: scale(1.1);
}
.user-link:hover {
  text-decoration: none;
  color: #f8f9fa;
  opacity: 0.85;
  cursor: pointer;
}

button {
  padding: 5px 10px;
}
</style>
