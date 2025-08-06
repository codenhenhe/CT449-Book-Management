<template>
  <div class="container my-5 d-flex justify-content-center">
    <div class="col-md-8 col-lg-6">
      <h3 class="mb-4 text-center">Thông tin đọc giả</h3>
      <div class="card p-4 shadow-sm mx-auto">
        <p><strong>Họ tên:</strong> {{ user.hoLot }} {{ user.ten }}</p>
        <p><strong>Mã quản trị viên:</strong> {{ user.maSo }}</p>
        <p><strong>Giới tính:</strong> {{ user.phai ? "Nam" : "Nữ" }}</p>
        <p><strong>Số điện thoại:</strong> {{ user.soDienThoai }}</p>
        <p><strong>Địa chỉ:</strong> {{ user.diaChi }}</p>
        <p><strong>Ngày sinh:</strong> {{ formattedDate(user.ngaySinh) }}</p>

        <div class="text-center mt-4">
          <router-link :to="{ name: 'docgia.edit' }" class="btn btn-primary">
            <i class="fas fa-edit"></i> Sửa thông tin
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref({});

onMounted(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    user.value = JSON.parse(stored);
  }
});

function formattedDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}
</script>

<style scoped>
/* Đảm bảo card không bị quá rộng và căn giữa hoàn toàn */
.card {
  width: 70%;
}
</style>
