<template>
  <div class="container my-5" style="max-width: 500px">
    <h3 class="mb-4">Quên mật khẩu</h3>

    <Form @submit="onSubmit" :validation-schema="schema">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <Field
          name="email"
          type="email"
          class="form-control"
          v-model="form.email"
          autocomplete="email"
        />
        <ErrorMessage name="email" class="text-danger small" />
      </div>

      <button class="btn btn-primary w-100">
        Gửi liên kết đặt lại mật khẩu
      </button>
    </Form>

    <button class="btn btn-secondary w-100 mt-3" @click="goBack">
      Quay lại
    </button>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import AuthService from "@/services/auth.service";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  email: "",
});

const schema = yup.object({
  email: yup
    .string()
    .required("Bắt buộc nhập email")
    .email("Email không hợp lệ"),
});

async function onSubmit() {
  try {
    await AuthService.forgotPassword({ email: form.email });

    await Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.",
    });

    router.push({ name: "login" });
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "Lỗi",
      text:
        err?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
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
