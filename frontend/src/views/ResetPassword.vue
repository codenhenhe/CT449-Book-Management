<template>
  <div class="container my-5" style="max-width: 500px">
    <h3 class="mb-4">Đặt lại mật khẩu</h3>

    <Form @submit="onSubmit" :validation-schema="schema">
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

      <button class="btn btn-primary w-100">Xác nhận</button>
    </Form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import AuthService from "@/services/auth.service";

const router = useRouter();
const route = useRoute();

const form = reactive({
  newPassword: "",
  confirmPassword: "",
});

const schema = yup.object({
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
    await AuthService.resetPassword(route.params.token, {
      newPassword: form.newPassword,
    });

    await Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Mật khẩu đã được thay đổi. Vui lòng đăng nhập.",
    });

    router.push({ name: "login" });
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Lỗi",
      text:
        err?.response?.data?.message ||
        "Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn.",
    });
  }
}
</script>
