<template>
  <div class="container mt-5 mb-5 d-flex justify-content-center">
    <div class="col-md-6 col-lg-5">
      <h3 class="mb-4 text-center">Đăng ký đọc giả</h3>

      <!-- Nếu đã đăng ký thành công -->
      <div v-if="maDocGia">
        <div class="alert alert-success text-center">
          <h5>🎉 Đăng ký thành công!</h5>
          <p>Mã đọc giả của bạn là:</p>
          <div
            class="d-flex justify-content-between align-items-center border p-2 rounded bg-light"
          >
            <strong>{{ maDocGia }}</strong>
            <button
              class="btn btn-sm btn-outline-primary"
              @click="copyToClipboard"
            >
              Sao chép
            </button>
          </div>
        </div>
        <div class="text-center mt-3">
          <button class="btn btn-primary" @click="goToLogin">
            Đến trang đăng nhập
          </button>
        </div>
      </div>

      <!-- Form đăng ký -->
      <form v-else @submit.prevent="register" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label class="form-label">Họ lót</label>
          <input v-model="form.hoLot" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Tên</label>
          <input v-model="form.ten" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Giới tính</label>
          <select v-model="form.phai" class="form-control" required>
            <option :value="true">Nam</option>
            <option :value="false">Nữ</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            required
            autocomplete="email"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="form.matKhau"
            type="password"
            class="form-control"
            required
            autocomplete="new-password"
          />
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

        <div class="text-center">
          <button class="btn btn-primary">Đăng ký</button>
          <router-link to="/login" class="btn btn-link"
            >Đã có tài khoản?</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ReaderService from "@/services/reader.service";

const router = useRouter();
const maDocGia = ref(null);

const form = reactive({
  hoLot: "",
  ten: "",
  phai: true, // true = Nam, false = Nữ
  email: "",
  matKhau: "",
  soDienThoai: "",
  diaChi: "",
  ngaySinh: "",
  vaiTro: "docgia",
});

async function register() {
  try {
    const res = await ReaderService.create(form);
    maDocGia.value = res.maDocGia;
    // KHÔNG redirect ngay nữa
  } catch (err) {
    console.error(err);
    alert("Đăng ký thất bại. Vui lòng thử lại.");
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(maDocGia.value);
  alert("Đã sao chép mã đọc giả vào clipboard!");
}

function goToLogin() {
  router.push({ name: "login" });
}
</script>

<style scoped>
.card {
  max-width: 500px;
  width: 100%;
}
</style>
