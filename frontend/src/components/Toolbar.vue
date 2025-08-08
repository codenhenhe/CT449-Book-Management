<template>
  <nav
    class="toolbar bg-dark text-white d-flex align-items-center justify-content-center shadow"
  >
    <SidebarItem
      icon="fa-home"
      text="Trang chủ"
      :to="homeRoute"
      :active="route.path === homeRoute"
    />
    <SidebarItem
      v-if="isReader"
      icon="fa-exchange-alt"
      text="Lịch sử mượn sách"
      to="/borrows"
      :active="route.path === '/borrows'"
    />
    <SidebarItem
      v-if="isStaffOrAdmin"
      icon="fa-book"
      text="Tất cả sách"
      to="/books"
      :active="route.path === '/books'"
    />
    <!-- <SidebarItem
      v-if="isStaffOrAdmin"
      icon="fa-plus"
      text="Thêm sách"
      to="/books/add"
      :active="route.path === '/books/add'"
    /> -->
    <SidebarItem
      v-if="isStaffOrAdmin"
      icon="fa-folder"
      text="Thể loại"
      to="/categories"
      :active="route.path === '/categories'"
    />
    <SidebarItem
      v-if="isStaffOrAdmin"
      icon="fa-user-pen"
      text="Tác giả"
      to="/authors"
      :active="route.path === '/authors'"
    />
    <SidebarItem
      v-if="isStaffOrAdmin"
      icon="fa-print"
      text="Nhà xuất bản"
      to="/publishers"
      :active="route.path === '/publishers'"
    />
    <SidebarItem
      v-if="isStaff"
      icon="fa-hand-holding"
      text="Quản lý mượn sách"
      to="/borrows/manager"
      :active="route.path === '/borrows/manager'"
    />
    <SidebarItem
      v-if="isAdmin"
      icon="fa-user"
      text="Người dùng"
      to="/admin/users"
      :active="route.path === '/admin/users'"
    />
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SidebarItem from "./SidebarItem.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const route = useRoute();

const isStaffOrAdmin = computed(() =>
  ["quantrivien", "nhanvien"].includes(auth.user?.vaiTro)
);
const isReader = computed(() => auth.user?.vaiTro === "docgia");
const isStaff = computed(() => auth.user?.vaiTro === "nhanvien");
const isAdmin = computed(() => auth.user?.vaiTro === "quantrivien");

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
.toolbar {
  position: sticky;
  top: 60px; /* hoặc chiều cao header */
  z-index: 999;
  padding: 0.5rem 1rem;
  gap: 1rem;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
