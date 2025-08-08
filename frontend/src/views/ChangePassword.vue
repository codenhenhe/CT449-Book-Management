<template>
  <div class="container my-5" style="max-width: 500px">
    <h3 class="mb-4 text-center">Đổi mật khẩu</h3>

    <Form @submit="onSubmit" :validation-schema="schema">
      <!-- Trường username ẩn để tránh cảnh báo trình duyệt -->
      <input
        type="text"
        name="username"
        :value="username"
        autocomplete="username"
        tabindex="-1"
        aria-hidden="true"
        style="
          position: absolute;
          left: -9999px;
          top: -9999px;
          height: 0;
          width: 0;
          opacity: 0;
        "
      />

      <!-- Mật khẩu cũ -->
      <div class="mb-3">
        <label class="form-label">Mật khẩu cũ</label>
        <Field
          name="oldPassword"
          type="password"
          class="form-control"
          v-model="form.oldPassword"
          autocomplete="off"
          :name="'currentPass_' + Math.random()"
        />

        <ErrorMessage name="oldPassword" class="text-danger small" />
      </div>

      <!-- Mật khẩu mới -->
      <div class="mb-3">
        <label class="form-label">Mật khẩu mới</label>
        <Field
          name="newPassword"
          type="password"
          class="form-control"
          v-model="form.newPassword"
          autocomplete="new-password"
        />
        <ErrorMessage name="newPassword" class="text-danger small" />
      </div>

      <!-- Xác nhận mật khẩu mới -->
      <div class="mb-3">
        <label class="form-label">Xác nhận mật khẩu mới</label>
        <Field
          name="confirmPassword"
          type="password"
          class="form-control"
          v-model="form.confirmPassword"
          autocomplete="new-password"
        />
        <ErrorMessage name="confirmPassword" class="text-danger small" />
      </div>

      <!-- Nút xác nhận -->
      <button class="btn btn-primary w-100 mb-2">Xác nhận</button>
    </Form>

    <!-- Nút quay lại -->
    <button class="btn btn-secondary w-100" @click="goBack">Quay lại</button>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import AuthService from "@/services/auth.service.js";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();

const username = computed(() => auth.user?.maSo || "");

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Xác thực với yup
const schema = yup.object({
  oldPassword: yup.string().required("Bắt buộc nhập mật khẩu cũ"),
  newPassword: yup
    .string()
    .required("Bắt buộc nhập mật khẩu mới")
    .min(6, "Tối thiểu 6 ký tự"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp")
    .required("Bắt buộc nhập xác nhận"),
});

async function onSubmit() {
  try {
    await AuthService.changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    // Hiển thị thành công
    await Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại!",
      confirmButtonText: "OK",
    });

    // Reset form
    form.oldPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";

    auth.logout();
    router.push({ name: "login" });
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      "Đổi mật khẩu thất bại. Vui lòng thử lại.";

    // Hiển thị lỗi
    await Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: message,
      confirmButtonText: "Thử lại",
    });
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
button {
  font-weight: 500;
}
</style>
