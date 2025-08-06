<template>
  <aside
    :class="[
      'sidebar bg-dark text-white d-flex flex-column shadow',
      { collapsed },
    ]"
  >
    <!-- Nút thu gọn -->
    <div class="toggle-container">
      <button
        class="btn btn-outline-light btn-sm"
        @click="collapsed = !collapsed"
        :title="collapsed ? 'Mở rộng' : 'Thu gọn'"
      >
        <i :class="collapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
      </button>
    </div>

    <!-- Menu items -->
    <nav class="nav flex-column flex-grow-1">
      <SidebarItem
        icon="fa-home"
        text="Trang chủ"
        :to="homeRoute"
        :collapsed="collapsed"
      />
      <SidebarItem
        v-if="isReader"
        icon="fa-book"
        text="Quản lý mượn sách"
        to="/borrows"
        :collapsed="collapsed"
      />
      <SidebarItem
        icon="fa-book"
        text="Tất cả sách"
        to="/books"
        :collapsed="collapsed"
      />
      <SidebarItem
        v-if="isStaffOrAdmin"
        icon="fa-plus"
        text="Thêm sách"
        to="/books/add"
        :collapsed="collapsed"
      />
      <SidebarItem
        v-if="isStaffOrAdmin"
        icon="fa-folder"
        text="Thể loại"
        to="/categories"
        :collapsed="collapsed"
      />
      <SidebarItem
        v-if="isStaffOrAdmin"
        icon="fa-user-pen"
        text="Tác giả"
        to="/authors"
        :collapsed="collapsed"
      />
      <SidebarItem
        v-if="isStaffOrAdmin"
        icon="fa-print"
        text="Nhà xuất bản"
        to="/publishers"
        :collapsed="collapsed"
      />
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import SidebarItem from "./SidebarItem.vue";
import { useAuthStore } from "@/stores/auth";

const collapsed = ref(false);
const auth = useAuthStore();

const isStaffOrAdmin = computed(() =>
  ["quantrivien", "nhanvien"].includes(auth.user?.vaiTro)
);

const isReader = computed(() => ["docgia"].includes(auth.user?.vaiTro));

const homeRoute = computed(() => {
  switch (auth.user?.vaiTro) {
    case "quantrivien":
      return "/admin";
    case "nhanvien":
      return "/staff";
    case "docgia":
      return "/books";
    default:
      return "/";
  }
});
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sidebar.collapsed {
  width: 70px;
  overflow-x: hidden;
}

.toggle-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 0 10px;
}

.sidebar.collapsed .toggle-container {
  justify-content: center;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.nav .nav-link {
  white-space: nowrap;
}
</style>
