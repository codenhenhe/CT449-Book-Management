<template>
  <div class="add-book container mt-5 mb-5">
    <div class="card p-4 shadow-lg w-100 mx-auto" style="max-width: 800px">
      <h2 class="card-title text-center mb-4 fw-bold text-primary">
        📚 Thêm Sách Mới
      </h2>
      <form @submit.prevent="submitBook" class="needs-validation" novalidate>
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label for="tenSach" class="form-label fw-bold">Tên sách *</label>
            <input
              v-model="formData.tenSach"
              id="tenSach"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="donGia" class="form-label fw-bold">Đơn giá *</label>
            <input
              v-model.number="formData.donGia"
              type="number"
              class="form-control"
              required
            />
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
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
          <div class="col-md-6">
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
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
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
          <div class="col-md-6">
            <label for="tenTheLoai" class="form-label fw-bold mr-2"
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
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label for="maNXB" class="form-label fw-bold mr-2"
              >Nhà xuất bản</label
            >
            <select v-model="formData.maNXB" class="form-select">
              <option value="">-- Chọn nhà xuất bản --</option>
              <option v-for="pub in publishers" :key="pub._id" :value="pub._id">
                {{ pub.tenNXB }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="maTacGia" class="form-label fw-bold mr-2"
              >Tác giả</label
            >
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
        </div>

        <div class="form-group mb-4">
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
          <div v-if="formData.hinhAnh" class="mt-2 text-center">
            <p class="mb-1 text-muted">Ảnh xem trước:</p>
            <img
              :src="formData.hinhAnh"
              alt="Ảnh bìa sách"
              class="img-thumbnail"
              style="max-width: 250px; border-radius: 8px"
            />
          </div>
        </div>

        <div class="d-flex justify-content-center gap-3">
          <button
            type="submit"
            class="btn btn-primary btn-lg mr-2"
            :disabled="uploading"
          >
            <span
              v-if="uploading"
              class="spinner-border spinner-border-sm mr-2"
              role="status"
            ></span>
            <i v-else class="fas fa-plus"></i> Thêm sách
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-lg ml-2"
            @click="goBack"
          >
            <i class="fas fa-arrow-left"></i> Quay lại
          </button>
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
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải dữ liệu từ server. Vui lòng thử lại sau.",
        });
      }
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      const loadingAlert = Swal.fire({
        title: "Đang tải ảnh lên...",
        text: "Vui lòng chờ trong giây lát.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

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
        loadingAlert.close();
        Swal.fire({
          icon: "success",
          title: "Tải ảnh lên thành công!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (err) {
        loadingAlert.close();
        Swal.fire({
          icon: "error",
          title: "Lỗi upload ảnh",
          text: err.message,
        });
        this.formData.hinhAnh = "";
        event.target.value = null; // Reset input file
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
          text: "Bạn đã thêm sách mới vào thư viện.",
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          this.resetForm();
          this.router.push("/books");
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Thêm sách thất bại",
          text: "Vui lòng kiểm tra lại thông tin. Đảm bảo các trường bắt buộc đã được điền đầy đủ.",
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
      // Reset input file
      document.getElementById("image").value = "";
    },
    goBack() {
      this.router.back();
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}
.card-title {
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 10px;
}
.form-label {
  color: #343a40;
}
.btn-lg {
  padding: 10px 20px;
  font-size: 1.1rem;
}
</style>
