<template>
  <div class="container my-4 d-flex justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <h3 class="mb-3 text-center fw-bold text-dark">Đăng ký đọc giả</h3>

      <Form
        @submit="register"
        :validation-schema="registrationSchema"
        class="card p-4 shadow-lg rounded-4"
      >
        <div class="row g-2">
          <div class="col-md-6">
            <div class="form-group mb-2">
              <label class="form-label small">Họ lót</label>
              <Field
                name="hoLot"
                type="text"
                class="form-control form-control-sm"
              />
              <div class="error-placeholder">
                <ErrorMessage name="hoLot" class="text-danger small" />
              </div>
            </div>
            <div class="form-group mb-2">
              <label class="form-label small">Tên</label>
              <Field
                name="ten"
                type="text"
                class="form-control form-control-sm"
              />
              <div class="error-placeholder">
                <ErrorMessage name="ten" class="text-danger small" />
              </div>
            </div>
            <div class="form-group mb-2">
              <label class="form-label small">Giới tính</label>
              <Field
                as="select"
                name="phai"
                class="form-control form-control-sm"
              >
                <option :value="true">Nam</option>
                <option :value="false">Nữ</option>
              </Field>
              <div class="error-placeholder">
                <ErrorMessage name="phai" class="text-danger small" />
              </div>
            </div>
            <div class="form-group mb-2">
              <label class="form-label small">Email</label>
              <Field
                name="email"
                type="email"
                class="form-control form-control-sm"
                autocomplete="email"
              />
              <div class="error-placeholder">
                <ErrorMessage name="email" class="text-danger small" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-2">
              <label class="form-label small">Mật khẩu</label>
              <Field
                name="matKhau"
                type="password"
                class="form-control form-control-sm"
                autocomplete="new-password"
              />
              <div class="error-placeholder">
                <ErrorMessage name="matKhau" class="text-danger small" />
              </div>
            </div>
            <div class="form-group mb-2">
              <label class="form-label small">Số điện thoại</label>
              <Field
                name="soDienThoai"
                type="text"
                class="form-control form-control-sm"
              />
              <div class="error-placeholder">
                <ErrorMessage name="soDienThoai" class="text-danger small" />
              </div>
            </div>
            <div class="form-group mb-2">
              <label class="form-label small">Địa chỉ</label>
              <Field
                name="diaChi"
                type="text"
                class="form-control form-control-sm"
              />
              <div class="error-placeholder">
                <ErrorMessage name="diaChi" class="text-danger small" />
              </div>
            </div>
            <div class="form-group mb-2">
              <label class="form-label small">Ngày sinh</label>
              <Field
                name="ngaySinh"
                type="date"
                class="form-control form-control-sm"
              />
              <div class="error-placeholder">
                <ErrorMessage name="ngaySinh" class="text-danger small" />
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column gap-2 mt-3">
          <button type="submit" class="btn btn-primary rounded-pill fw-bold">
            Đăng ký
          </button>
          <router-link to="/login" class="btn btn-link fw-semibold"
            >Đã có tài khoản? Đăng nhập ngay!</router-link
          >
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import ReaderService from "@/services/reader.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";

const router = useRouter();

const registrationSchema = yup.object({
  hoLot: yup
    .string()
    .required("Họ lót không được để trống.")
    .min(2, "Họ lót phải có ít nhất 2 ký tự."),
  ten: yup
    .string()
    .required("Tên không được để trống.")
    .min(2, "Tên phải có ít nhất 2 ký tự."),
  phai: yup.boolean().required("Giới tính không được để trống."),
  email: yup
    .string()
    .required("Email không được để trống.")
    .email("Email không hợp lệ."),
  matKhau: yup
    .string()
    .required("Mật khẩu không được để trống.")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  soDienThoai: yup
    .string()
    .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ.")
    .max(15, "Số điện thoại không hợp lệ."),
  diaChi: yup.string(),
  ngaySinh: yup.date().nullable(),
});

async function register(values) {
  try {
    const formValues = {
      ...values,
      ngaySinh: values.ngaySinh
        ? new Date(values.ngaySinh).toISOString()
        : null,
      vaiTro: "docgia",
    };

    const res = await ReaderService.create(formValues);

    // Hiển thị thông báo thành công với nút copy
    Swal.fire({
      icon: "success",
      title: "Đăng ký thành công!",
      html: `
        Mã đọc giả của bạn là: <strong>${res.maDocGia}</strong>
        <br>
        <button id="copyMaDocGia" class="btn btn-sm btn-outline-secondary mt-2">
          <i class="fas fa-copy me-1"></i> Sao chép mã đọc giả
        </button>
      `,
      confirmButtonText: "Đến trang đăng nhập",
      didOpen: () => {
        // Thêm sự kiện click cho nút copy
        const copyButton = document.getElementById("copyMaDocGia");
        copyButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(res.maDocGia);
            Swal.fire({
              icon: "success",
              title: "Đã sao chép!",
              text: `Mã đọc giả ${res.maDocGia} đã được sao chép vào clipboard.`,
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Lỗi sao chép",
              text: "Không thể sao chép mã đọc giả. Vui lòng thử lại.",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: "login" });
      }
    });
  } catch (err) {
    // Xử lý lỗi từ backend
    const errorMessage =
      err.response?.data?.error || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    Swal.fire({
      icon: "error",
      title: "Đăng ký thất bại",
      text: errorMessage,
    });
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 0.75rem;
}

.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px);
}

.error-placeholder {
  min-height: 1.25rem;
}

.small {
  font-size: 0.8rem;
}
</style>
