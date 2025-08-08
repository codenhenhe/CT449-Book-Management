<template>
  <main class="content-area">
    <div class="dashboard-header mb-4">
      <h1 class="text-primary">Chào mừng, {{ user.hoTen }}!</h1>
      <p class="lead text-muted">Bảng điều khiển tổng quan</p>
    </div>

    <div class="row">
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card shadow-sm h-100 bg-info text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-book mr-2"></i>Tổng số sách
            </h5>
            <h2 class="card-text">{{ statistics.totalBooks }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card shadow-sm h-100 bg-warning text-dark">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-handshake mr-2"></i>Đơn mượn chờ xử lý
            </h5>
            <h2 class="card-text">{{ statistics.pendingBorrows }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card shadow-sm h-100 bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-users mr-2"></i>Tổng đọc giả
            </h5>
            <h2 class="card-text">{{ statistics.totalReaders }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card shadow-sm h-100 bg-secondary text-white">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-calendar-check mr-2"></i>Lượt mượn hôm nay
            </h5>
            <h2 class="card-text">{{ statistics.borrowsToday }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm mt-4">
      <div class="card-header bg-white border-0">
        <h5 class="mb-0"><i class="fas fa-bell mr-2"></i>Công việc gần đây</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item d-flex justify-content-between align-items-start"
          v-for="task in recentTasks"
          :key="task.id"
        >
          <div class="ml-2 mr-auto">
            <div class="fw-bold">{{ task.title }}</div>
            {{ task.description }}
          </div>
          <span class="badge bg-primary rounded-pill">{{ task.status }}</span>
        </li>
      </ul>
      <div v-if="recentTasks.length === 0" class="text-center text-muted p-4">
        Không có công việc nào cần xử lý.
      </div>
    </div>

    <router-view />
  </main>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const user = ref({ hoTen: "Nhân viên A" }); // Lấy thông tin user từ localStorage hoặc API
    const statistics = ref({
      totalBooks: 0,
      pendingBorrows: 0,
      totalReaders: 0,
      borrowsToday: 0,
    });
    const recentTasks = ref([]);

    onMounted(async () => {
      // Dữ liệu giả để minh họa
      user.value.hoTen =
        JSON.parse(localStorage.getItem("user")).ten || "Nhân viên";
      statistics.value = {
        totalBooks: 540,
        pendingBorrows: 12,
        totalReaders: 250,
        borrowsToday: 5,
      };
      recentTasks.value = [
        {
          id: 1,
          title: "Đơn mượn sách mới",
          description: 'Đọc giả Nguyễn Văn A vừa đặt mượn sách "Nhà giả kim".',
          status: "Chờ xử lý",
        },
        {
          id: 2,
          title: "Sách đã trả",
          description: 'Đọc giả B đã trả sách "Đắc nhân tâm".',
          status: "Đã hoàn tất",
        },
        {
          id: 3,
          title: "Đơn mượn sách mới",
          description: 'Đọc giả C vừa đặt mượn sách "Harry Potter".',
          status: "Chờ xử lý",
        },
      ];
    });

    return {
      user,
      statistics,
      recentTasks,
    };
  },
};
</script>

<style scoped>
.content-area {
  padding: 1rem 4rem;
  min-height: calc(100vh - 120px);
  transition: margin-left 0.3s ease;
  background-color: #f8f9fa;
}

.dashboard-header h1 {
  font-weight: 600;
  color: #343a40;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 2.5rem;
  font-weight: 700;
}

.list-group-item .fw-bold {
  color: #343a40;
}

.list-group-item .text-muted {
  font-size: 0.9rem;
}
</style>
