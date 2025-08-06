<template>
  <div class="add-book container mt-5">
    <div class="card p-4 shadow-sm w-75 mx-auto">
      <h2 class="card-title text-center mb-4">Thêm Sách Mới</h2>
      <form @submit.prevent="submitBook" class="needs-validation" novalidate>
        <!-- Thông tin sách -->
        <div class="form-group mb-3">
          <label for="tenSach" class="form-label fw-bold">Tên sách *</label>
          <input
            v-model="formData.tenSach"
            id="tenSach"
            class="form-control"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="donGia" class="form-label fw-bold">Đơn giá *</label>
          <input
            v-model.number="formData.donGia"
            id="donGia"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="tongSoSach" class="form-label fw-bold"
            >Tổng số sách *</label
          >
          <input
            v-model.number="formData.tongSoSach"
            id="tongSoSach"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="soQuyenConLai" class="form-label fw-bold"
            >Số quyển còn lại *</label
          >
          <input
            v-model.number="formData.soQuyenConLai"
            id="soQuyenConLai"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="namXuatBan" class="form-label fw-bold"
            >Năm xuất bản *</label
          >
          <input
            v-model.number="formData.namXuatBan"
            id="namXuatBan"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="maNXB" class="form-label">Mã nhà xuất bản</label>
          <input v-model="formData.maNXB" id="maNXB" class="form-control" />
        </div>

        <div class="form-group mb-3">
          <label for="maTacGia" class="form-label">Mã tác giả</label>
          <input
            v-model="formData.maTacGia"
            id="maTacGia"
            class="form-control"
          />
        </div>

        <div class="form-group mb-3">
          <label for="tenTheLoai" class="form-label">Tên thể loại</label>
          <input
            v-model="formData.tenTheLoai"
            id="tenTheLoai"
            class="form-control"
          />
        </div>

        <!-- Ảnh bìa -->
        <div class="form-group mb-3">
          <label for="image" class="form-label fw-bold"
            >Chọn ảnh bìa sách</label
          >
          <input
            type="file"
            @change="uploadImage"
            id="image"
            accept="image/*"
            class="form-control"
          />
          <div v-if="formData.hinhAnh" class="mt-2">
            <p class="mb-1">Xem trước:</p>
            <img
              :src="formData.hinhAnh"
              alt="preview"
              class="img-thumbnail"
              style="max-width: 200px"
            />
          </div>
          <div v-if="uploading" class="mt-2 text-muted">
            <em>Đang tải ảnh lên...</em>
          </div>
        </div>

        <div class="text-center mx-auto">
          <div
            class="btn-group"
            role="group"
            style="display: flex; justify-content: center"
          >
            <button
              type="submit"
              class="btn btn-primary mr-5"
              :disabled="uploading"
              style="min-width: 120px; padding: 0.5rem 1rem"
            >
              <span
                v-if="uploading"
                class="spinner-border spinner-border-sm mr-2"
                role="status"
              ></span>
              Thêm sách
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="goBack"
              style="min-width: 120px; padding: 0.5rem 1rem"
            >
              Quay lại
            </button>
          </div>
        </div>
      </form>

      <p
        v-if="message"
        class="mt-3 text-center"
        :class="{
          'text-success': message.includes('thành công'),
          'text-danger': message.includes('thất bại'),
        }"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/book.service";
import { useRouter } from "vue-router";

export default {
  name: "AddBook",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      formData: {
        tenSach: "",
        donGia: null,
        tongSoSach: null,
        soQuyenConLai: null,
        namXuatBan: null,
        maNXB: "",
        maTacGia: "",
        tenTheLoai: "",
        hinhAnh: "",
      },
      uploading: false,
      message: "",
    };
  },
  methods: {
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        const data = await res.json();

        if (data.error) {
          console.error("Cloudinary báo lỗi:", data.error.message);
          alert("Upload ảnh thất bại: " + data.error.message);
          this.uploading = false;
          return;
        }

        this.formData.hinhAnh = data.secure_url;
        console.log("Cloudinary upload response:", data);
        console.log("Hình ảnh nè:", this.formData.hinhAnh);
      } catch (err) {
        console.error("Upload ảnh thất bại", err);
        alert("Không thể tải ảnh lên. Vui lòng thử lại.");
      } finally {
        this.uploading = false;
      }
    },
    async submitBook() {
      if (this.uploading) {
        alert("Đang tải ảnh lên. Vui lòng chờ...");
        return;
      }

      try {
        const payload = {
          tenSach: this.formData.tenSach,
          donGia: Number(this.formData.donGia),
          tongSoSach: Number(this.formData.tongSoSach),
          soQuyenConLai: Number(this.formData.soQuyenConLai),
          namXuatBan: Number(this.formData.namXuatBan),
          maNXB: this.formData.maNXB || undefined,
          maTacGia: this.formData.maTacGia || undefined,
          tenTheLoai: this.formData.tenTheLoai || undefined,
          hinhAnh: this.formData.hinhAnh || undefined,
        };

        console.log("Dữ liệu gửi lên:", payload);
        await BookService.create(payload);
        this.message = "✅ Thêm sách thành công!";
        this.resetForm();
      } catch (error) {
        console.error(error);
        this.message = "❌ Thêm sách thất bại. Vui lòng kiểm tra lại.";
      }
    },

    resetForm() {
      this.formData = {
        tenSach: "",
        donGia: null,
        tongSoSach: null,
        soQuyenConLai: null,
        namXuatBan: null,
        maNXB: "",
        maTacGia: "",
        tenTheLoai: "",
        hinhAnh: "",
      };
    },
    goBack() {
      this.router.back();
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.btn-group {
  display: flex !important;
  justify-content: center !important;
}
.btn-group .btn {
  flex: 1;
  min-width: 120px;
  max-width: 200px;
}
</style>
