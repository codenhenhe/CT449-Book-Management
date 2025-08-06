<template>
  <div
    class="container my-4 my-md-5 d-flex align-items-center justify-content-center"
  >
    <div class="col-12 col-md-10 col-lg-8">
      <div
        class="card shadow-lg border-0 rounded-4 p-4 p-md-5 position-relative overflow-hidden"
      >
        <div class="card-bg-overlay"></div>

        <header class="text-center mb-5 position-relative">
          <div class="user-avatar-container mx-auto mb-3">
            <font-awesome-icon
              icon="user-circle"
              class="text-dark-theme"
              style="font-size: 3.5rem"
              aria-hidden="true"
            />
          </div>
          <h3 class="fw-bold text-dark mb-1">Thông tin đọc giả</h3>
          <p class="text-muted small mb-0">
            Cập nhật và quản lý thông tin cá nhân
          </p>
        </header>

        <section class="info-columns position-relative row g-4">
          <div class="col-md-4 d-flex flex-column gap-4">
            <div class="info-item">
              <font-awesome-icon
                icon="id-badge"
                class="info-icon text-dark-theme"
                aria-hidden="true"
              />
              <div class="info-content">
                <span class="info-label">Mã số đọc giả</span>
                <span class="info-value text-muted">{{
                  user.maSo || "N/A"
                }}</span>
              </div>
            </div>
            <div class="info-item">
              <font-awesome-icon
                icon="user"
                class="info-icon text-dark-theme"
                aria-hidden="true"
              />
              <div class="info-content">
                <span class="info-label">Họ tên</span>
                <span class="info-value text-muted">{{
                  fullName || "N/A"
                }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 d-flex flex-column gap-4">
            <div class="info-item">
              <font-awesome-icon
                icon="venus-mars"
                class="info-icon text-dark-theme"
                aria-hidden="true"
              />
              <div class="info-content">
                <span class="info-label">Giới tính</span>
                <span class="info-value text-muted">{{ gender || "N/A" }}</span>
              </div>
            </div>
            <div class="info-item">
              <font-awesome-icon
                icon="phone"
                class="info-icon text-dark-theme"
                aria-hidden="true"
              />
              <div class="info-content">
                <span class="info-label">Số điện thoại</span>
                <span class="info-value text-muted">{{
                  user.soDienThoai || "N/A"
                }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 d-flex flex-column gap-4">
            <div class="info-item">
              <font-awesome-icon
                icon="calendar-alt"
                class="info-icon text-dark-theme"
                aria-hidden="true"
              />
              <div class="info-content">
                <span class="info-label">Ngày sinh</span>
                <span class="info-value text-muted">{{
                  formattedDate(user.ngaySinh)
                }}</span>
              </div>
            </div>
            <div class="info-item">
              <font-awesome-icon
                icon="map-marker-alt"
                class="info-icon text-dark-theme"
                aria-hidden="true"
              />
              <div class="info-content">
                <span class="info-label">Địa chỉ</span>
                <span class="info-value text-muted">{{
                  user.diaChi || "N/A"
                }}</span>
              </div>
            </div>
          </div>
        </section>

        <div class="text-center mt-5 position-relative">
          <router-link
            :to="{ name: 'docgia.edit' }"
            class="btn btn-dark w-100 rounded-pill fw-semibold shadow-sm btn-edit"
          >
            <font-awesome-icon icon="edit" class="me-2" />
            Sửa thông tin
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faIdBadge,
  faVenusMars,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faEdit,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUser,
  faIdBadge,
  faVenusMars,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faEdit,
  faUserCircle
);

const user = ref({});

const fullName = computed(() => {
  if (user.value.hoLot && user.value.ten) {
    return `${user.value.hoLot} ${user.value.ten}`;
  }
  return user.value.hoLot || user.value.ten || null;
});

const gender = computed(() => {
  if (user.value.phai !== undefined) {
    return user.value.phai ? "Nam" : "Nữ";
  }
  return null;
});

onMounted(() => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      user.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
});

function formattedDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("vi-VN");
  } catch {
    return "N/A";
  }
}
</script>

<style scoped>
:root {
  --primary-color: #343a40;
  --secondary-color: #6c757d;
  --bg-light: #f8f9fa;
  --card-bg: #ffffff;
  --shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.card-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 100% 0,
    rgba(52, 58, 64, 0.08) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  opacity: 0.7;
  z-index: 0;
}

.card {
  box-shadow: var(--shadow-lg);
  background-color: var(--card-bg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);
}

.user-avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.user-avatar-container:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(52, 58, 64, 0.2);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.info-icon {
  flex-shrink: 0;
  font-size: 1.5rem;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1rem;
  color: var(--secondary-color);
}

.btn-edit {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(52, 58, 64, 0.2);
}

.text-dark-theme {
  color: var(--primary-color) !important;
}
</style>
