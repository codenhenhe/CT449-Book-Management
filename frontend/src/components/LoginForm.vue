<template>
  <Form @submit="handleLogin" :validation-schema="loginSchema">
    <div class="mb-3">
      <label for="maDangNhap" class="form-label">Mã đăng nhập</label>
      <Field
        name="maDangNhap"
        type="text"
        class="form-control"
        v-model="credentials.maDangNhap"
      />
      <ErrorMessage name="maDangNhap" class="text-danger small" />
    </div>

    <div class="mb-3">
      <label for="matKhau" class="form-label">Mật khẩu</label>
      <Field
        name="matKhau"
        type="password"
        class="form-control"
        v-model="credentials.matKhau"
      />
      <ErrorMessage name="matKhau" class="text-danger small" />
    </div>

    <button class="btn btn-primary w-100">Đăng nhập</button>
  </Form>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import AuthService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const credentials = reactive({
  maDangNhap: "",
  matKhau: "",
});

const loginSchema = yup.object({
  maDangNhap: yup.string().required("Bắt buộc nhập mã đăng nhập"),
  matKhau: yup.string().required("Bắt buộc nhập mật khẩu"),
});

async function handleLogin() {
  try {
    const data = await AuthService.login(credentials);

    // Cập nhật store
    auth.login(data.user, data.token);

    // Điều hướng theo vai trò
    switch (data.user.vaiTro) {
      case "quantrivien":
        router.push({ name: "quantrivien" });
        break;
      case "nhanvien":
        router.push({ name: "nhanvien" });
        break;
      case "docgia":
        router.push({ name: "books" });
        break;
      default:
        alert("Vai trò không hợp lệ.");
    }
  } catch (err) {
    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    console.error(err);
  }
}
</script>
