<template>
  <main class="dashboard-area">
    <div class="container mt-4">
      <h2 class="mb-4 text-primary">
        <i class="fas fa-crown mr-2"></i>Chào mừng,
        {{ user.name || "Quản trị viên" }}
      </h2>

      <div class="row">
        <div
          class="col-md-6 col-lg-3 mb-4"
          v-for="stat in stats"
          :key="stat.label"
        >
          <div :class="['card h-100 shadow-sm border-0', stat.bg]">
            <div
              class="card-body d-flex flex-column justify-content-between text-white"
            >
              <div class="d-flex align-items-center mb-2">
                <i :class="[stat.icon, 'fa-2x mr-3']"></i>
                <div class="text-start">
                  <p class="card-title text-uppercase mb-0">{{ stat.label }}</p>
                  <h4 class="card-text font-weight-bold">{{ stat.value }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <h4>
          <i class="fas fa-exclamation-triangle mr-2 text-danger"></i>Sách quá
          hạn
        </h4>
        <div
          v-if="overdueBooks.length === 0"
          class="alert alert-success text-center mt-3"
          role="alert"
        >
          Không có sách quá hạn.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover table-striped mt-3">
            <thead class="thead-dark">
              <tr>
                <th>Đọc giả</th>
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
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

// Dữ liệu giả
const user = ref({
  name: "Quản trị viên",
});

const stats = ref([
  { label: "Tổng số sách", value: 1200, bg: "bg-primary", icon: "fas fa-book" },
  { label: "Đọc giả", value: 350, bg: "bg-success", icon: "fas fa-users" },
  {
    label: "Đang được mượn",
    value: 150,
    bg: "bg-warning",
    icon: "fas fa-handshake",
  },
  { label: "Sách quá hạn", value: 5, bg: "bg-danger", icon: "fas fa-clock" },
]);

const overdueBooks = ref([]);

// Hàm lấy dữ liệu từ API (giả định)
const fetchData = async () => {
  try {
    // Giả lập lấy dữ liệu từ API
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          overdue: [
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
          ],
          stats: [
            {
              label: "Tổng số sách",
              value: 1200,
              bg: "bg-primary",
              icon: "fas fa-book",
            },
            {
              label: "Đọc giả",
              value: 350,
              bg: "bg-success",
              icon: "fas fa-users",
            },
            {
              label: "Đang được mượn",
              value: 150,
              bg: "bg-warning",
              icon: "fas fa-handshake",
            },
            {
              label: "Sách quá hạn",
              value: 5,
              bg: "bg-danger",
              icon: "fas fa-clock",
            },
          ],
        });
      }, 500);
    });

    // Gán dữ liệu sau khi lấy thành công
    overdueBooks.value = response.overdue;
    stats.value = response.stats;

    // Giả định lấy tên user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.ten) {
      user.value.name = storedUser.ten;
    }
  } catch (err) {
    Swal.fire("Lỗi", "Không thể tải dữ liệu trang chủ", "error");
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dashboard-area {
  padding: 1rem 2rem;
  min-height: calc(100vh - 120px);
  background-color: #f8f9fa;
  transition: all 0.3s ease-in-out;
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
}

.card .card-title {
  font-size: 0.9rem;
  opacity: 0.9;
}

.card .card-text {
  font-size: 1.8rem;
  line-height: 1.2;
}

th,
td {
  vertical-align: middle;
}
</style>
