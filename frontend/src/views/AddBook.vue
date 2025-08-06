<template>
  <div class="add-book container mt-5">
    <div class="card p-4 shadow-sm w-75 mx-auto">
      <h2 class="card-title text-center mb-4">Thêm Sách Mới</h2>
      <form @submit.prevent="submitBook" class="needs-validation" novalidate>
        <!-- Các trường văn bản -->
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
            type="number"
            class="form-control"
            required
          />
        </div>

        <!-- Nhà xuất bản -->
        <div class="form-group mb-3">
          <label for="maNXB" class="form-label fw-bold">Nhà xuất bản</label>
          <select v-model="formData.maNXB" class="form-select">
            <option value="">-- Chọn nhà xuất bản --</option>
            <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
              {{ pub.tenNXB }}
            </option>
          </select>
        </div>

        <!-- Tác giả -->
        <div class="form-group mb-3">
          <label for="maTacGia" class="form-label fw-bold">Tác giả</label>
          <select v-model="formData.maTacGia" class="form-select">
            <option value="">-- Chọn tác giả --</option>
            <option
              v-for="author in authors"
              :key="author._id"
              :value="author._id"
            >
              {{ author.tenTacGia }}
            </option>
          </select>
        </div>

        <!-- Thể loại -->
        <div class="form-group mb-3">
          <label for="tenTheLoai" class="form-label fw-bold"
            >Thể loại sách</label
          >
          <select v-model="formData.tenTheLoai" class="form-select">
            <option value="">-- Chọn thể loại --</option>
            <option
              v-for="cat in categories"
              :key="cat._id"
              :value="cat.tenTheLoai"
            >
              {{ cat.tenTheLoai }}
            </option>
          </select>
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

        <!-- Nút submit -->
        <div class="text-center mx-auto">
          <div class="btn-group" style="display: flex; justify-content: center">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="uploading"
              style="min-width: 120px"
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
              class="btn btn-secondary ml-5"
              @click="goBack"
              style="min-width: 120px"
            >
              Quay lại
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import BookService from "@/services/book.service.js";
import AuthorService from "@/services/author.service.js";
import CategoryService from "@/services/category.service.js";
import PublisherService from "@/services/publisher.service.js";
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
      authors: [],
      categories: [],
      publishers: [],
    };
  },
  mounted() {
    this.fetchDropdownData();
  },
  methods: {
    async fetchDropdownData() {
      try {
        this.authors = await AuthorService.getAll();
        this.categories = await CategoryService.getAll();
        this.publishers = await PublisherService.getAll();
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dropbox:", err);
      }
    },
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
        if (data.error) throw new Error(data.error.message);

        this.formData.hinhAnh = data.secure_url;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi upload ảnh",
          text: err.message,
        });
      } finally {
        this.uploading = false;
      }
    },
    async submitBook() {
      if (this.uploading) {
        Swal.fire({
          icon: "info",
          title: "Vui lòng chờ",
          text: "Đang tải ảnh lên...",
        });
        return;
      }

      try {
        const payload = {
          ...this.formData,
          donGia: Number(this.formData.donGia),
          tongSoSach: Number(this.formData.tongSoSach),
          soQuyenConLai: Number(this.formData.soQuyenConLai),
          namXuatBan: Number(this.formData.namXuatBan),
        };

        await BookService.create(payload);

        Swal.fire({
          icon: "success",
          title: "Thêm sách thành công!",
          showConfirmButton: false,
          timer: 1500,
        });

        this.resetForm();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Thêm sách thất bại",
          text: "Vui lòng kiểm tra lại thông tin.",
        });
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
.btn-group .btn {
  flex: 1;
  min-width: 120px;
  max-width: 200px;
}
</style>
