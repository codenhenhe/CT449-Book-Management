<template>
  <div class="user-management container mt-5">
    <h2 class="text-primary fw-bold text-center mb-4">Quản lý Người Dùng</h2>

    <ul class="nav nav-tabs nav-justified" id="userTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'readers' }"
          @click="setActiveTab('readers')"
          type="button"
          role="tab"
        >
          Đọc giả
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'staffs' }"
          @click="setActiveTab('staffs')"
          type="button"
          role="tab"
        >
          Nhân viên
        </button>
      </li>
    </ul>

    <div
      class="tab-content border border-top-0 p-3 rounded-bottom"
      id="userTabsContent"
    >
      <div v-if="activeTab === 'readers'" class="tab-pane fade show active">
        <UserList
          :users="readers"
          userType="readers"
          :loading="loading"
          @refresh="fetchReaders"
        />
      </div>

      <div v-if="activeTab === 'staffs'" class="tab-pane fade show active">
        <UserList
          :users="staffs"
          userType="staffs"
          :loading="loading"
          @refresh="fetchStaffs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/services/admin.service";
import UserList from "@/components/UserList.vue";
import Swal from "sweetalert2";

const readers = ref([]);
const staffs = ref([]);
const loading = ref(true);
const activeTab = ref("readers");

// Hàm tải danh sách đọc giả
async function fetchReaders() {
  try {
    loading.value = true;
    readers.value = await AdminService.getAllReaders();
  } catch (error) {
    console.error("Lỗi khi tải đọc giả:", error);
    Swal.fire("Lỗi", "Không thể tải danh sách đọc giả.", "error");
  } finally {
    loading.value = false;
  }
}

// Hàm tải danh sách nhân viên
async function fetchStaffs() {
  try {
    loading.value = true;
    staffs.value = await AdminService.getAllStaffs();
  } catch (error) {
    console.error("Lỗi khi tải nhân viên:", error);
    Swal.fire("Lỗi", "Không thể tải danh sách nhân viên.", "error");
  } finally {
    loading.value = false;
  }
}

// Hàm chuyển đổi tab và tải dữ liệu tương ứng
function setActiveTab(tab) {
  activeTab.value = tab;
  if (tab === "readers") {
    fetchReaders();
  } else {
    fetchStaffs();
  }
}

onMounted(() => {
  fetchReaders();
});
</script>

<style scoped>
.user-management .nav-link.active {
  background-color: #0d6efd;
  color: white;
}
.tab-content {
  min-height: 400px;
}
</style>
