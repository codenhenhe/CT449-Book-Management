<!-- src/views/reader/EditReaderProfile.vue -->
<template>
  <div class="container mt-5">
    <h3 class="mb-4">Chỉnh sửa thông tin</h3>
    <form @submit.prevent="updateProfile" class="card p-4 shadow-sm">
      <div class="mb-3">
        <label class="form-label">Họ lót</label>
        <input v-model="form.hoLot" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input v-model="form.ten" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input v-model="form.soDienThoai" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input v-model="form.diaChi" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Ngày sinh</label>
        <input type="date" v-model="form.ngaySinh" class="form-control" />
      </div>

      <button class="btn btn-success">Lưu thay đổi</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import ReaderService from "@/services/reader.service";

const router = useRouter();
const form = reactive({
  hoLot: "",
  ten: "",
  soDienThoai: "",
  diaChi: "",
  ngaySinh: "",
});

onMounted(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const user = JSON.parse(stored);
    Object.assign(form, user);
  }
});

async function updateProfile() {
  try {
    await ReaderService.update(form.id, form);
    alert("Cập nhật thành công!");
    localStorage.setItem("user", JSON.stringify(form));
    router.push({ name: "docgia.profile" });
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra.");
  }
}
</script>
