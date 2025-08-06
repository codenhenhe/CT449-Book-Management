<template>
  <main class="content-area">
    <div class="container mt-4">
      <h2 class="mb-4">👋 Chào mừng, {{ user.name || "Nhân viên" }}</h2>

      <!-- Dashboard thống kê -->
      <div class="row">
        <div class="col-md-3 mb-3" v-for="stat in stats" :key="stat.label">
          <div :class="['card', 'text-white', stat.bg]">
            <div class="card-body">
              <div class="card-title font-weight-bold">{{ stat.label }}</div>
              <h4 class="card-text">{{ stat.value }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Hành động nhanh -->
      <div class="mt-4">
        <h4>⚡ Hành động nhanh</h4>
        <div class="btn-group mt-2" role="group">
          <router-link to="/books/add" class="btn btn-primary">
            📚 Thêm sách
          </router-link>
          <router-link to="/readers/add" class="btn btn-success">
            👤 Thêm độc giả
          </router-link>
          <router-link to="/borrow" class="btn btn-info">
            📖 Quản lý mượn trả
          </router-link>
          <router-link to="/categories" class="btn btn-secondary">
            🗂 Quản lý thể loại
          </router-link>
        </div>
      </div>

      <!-- Sách quá hạn -->
      <div class="mt-5">
        <h4>📌 Sách quá hạn</h4>
        <div v-if="overdueBooks.length === 0" class="text-muted">
          Không có sách quá hạn.
        </div>
        <table v-else class="table table-bordered mt-3">
          <thead class="thead-light">
            <tr>
              <th>Độc giả</th>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in overdueBooks" :key="item._id">
              <td>{{ item.readerName }}</td>
              <td>{{ item.bookTitle }}</td>
              <td>{{ formatDate(item.borrowDate) }}</td>
              <td class="text-danger font-weight-bold">
                {{ formatDate(item.dueDate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

// Thông tin nhân viên (giả định, có thể lấy từ store hoặc API)
const user = ref({
  name: "Nguyễn Văn A",
});

// Dữ liệu thống kê giả (bạn nên thay bằng gọi API thật nếu có)
const stats = ref([
  { label: "Tổng số sách", value: 1200, bg: "bg-primary" },
  { label: "Độc giả", value: 350, bg: "bg-success" },
  { label: "Đang được mượn", value: 150, bg: "bg-warning" },
  { label: "Sách quá hạn", value: 5, bg: "bg-danger" },
]);

// Dữ liệu sách quá hạn (giả định)
const overdueBooks = ref([]);

onMounted(async () => {
  try {
    // TODO: Gọi API thực tế nếu có
    overdueBooks.value = [
      {
        _id: 1,
        readerName: "Trần Thị B",
        bookTitle: "Doraemon Tập 10",
        borrowDate: "2025-07-01",
        dueDate: "2025-07-15",
      },
      {
        _id: 2,
        readerName: "Lê Văn C",
        bookTitle: "Lập trình Python cơ bản",
        borrowDate: "2025-06-20",
        dueDate: "2025-07-05",
      },
    ];
  } catch (err) {
    Swal.fire("Lỗi", "Không thể tải dữ liệu sách quá hạn", "error");
  }
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
</script>

<style scoped>
.content-area {
  margin-left: 220px;
  padding: 1rem;
  min-height: calc(100vh - 120px);
  transition: margin-left 0.3s ease;
}

.card {
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1rem;
}

.card-text {
  font-size: 1.5rem;
}

th,
td {
  vertical-align: middle;
}
</style>
