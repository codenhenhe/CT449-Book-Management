<template>
  <div class="container mt-5">
    <h3 class="mb-4 text-center">Chỉnh sửa thông tin</h3>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form @submit.prevent="updateProfile" class="card p-4 shadow-sm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="hoLot" class="form-label">Họ lót</label>
              <input id="hoLot" v-model="form.hoLot" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label for="ten" class="form-label">Tên</label>
              <input id="ten" v-model="form.ten" class="form-control" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                class="form-control"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label d-block">Giới tính</label>
              <div class="d-flex align-items-center mt-2">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="male"
                    :value="true"
                    v-model="form.phai"
                  />
                  <label class="form-check-label" for="male">Nam</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="female"
                    :value="false"
                    v-model="form.phai"
                  />
                  <label class="form-check-label" for="female">Nữ</label>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="soDienThoai" class="form-label">Số điện thoại</label>
              <input
                id="soDienThoai"
                v-model="form.soDienThoai"
                class="form-control"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="ngaySinh" class="form-label">Ngày sinh</label>
              <input
                id="ngaySinh"
                type="date"
                v-model="form.ngaySinh"
                class="form-control"
              />
            </div>
          </div>

          <div class="mb-4">
            <label for="diaChi" class="form-label">Địa chỉ</label>
            <input id="diaChi" v-model="form.diaChi" class="form-control" />
          </div>

          <button class="btn btn-success w-100">Lưu thay đổi</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdminService from "@/services/admin.service";

const router = useRouter();
const form = reactive({
  hoLot: "",
  ten: "",
  soDienThoai: "",
  diaChi: "",
  ngaySinh: "",
  email: "",
  phai: null,
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
    await AdminService.update(form.id, form);
    alert("Cập nhật thành công!");
    localStorage.setItem("user", JSON.stringify(form));
    router.push({ name: "quantrivien.profile" });
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra.");
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
.card {
  border: none;
  border-radius: 12px;
}
.form-label {
  font-weight: 500;
  color: #555;
}
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-weight: 600;
  padding: 10px 0;
}
</style>
