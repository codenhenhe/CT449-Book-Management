<template>
  <div class="edit-book container mt-5">
    <div class="card p-4 shadow-sm w-75 mx-auto">
      <h2 class="card-title text-center mb-4">✏️ Sửa Thông Tin Sách</h2>

      <form @submit.prevent="updateBook" class="needs-validation" novalidate>
        <!-- Form giống AddBook.vue -->
        <div class="mb-3">
          <label class="form-label fw-bold">Tên sách *</label>
          <input v-model="formData.tenSach" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Đơn giá *</label>
          <input
            v-model.number="formData.donGia"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Tổng số sách *</label>
          <input
            v-model.number="formData.tongSoSach"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Số quyển còn lại *</label>
          <input
            v-model.number="formData.soQuyenConLai"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Năm xuất bản *</label>
          <input
            v-model.number="formData.namXuatBan"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mã nhà xuất bản</label>
          <input v-model="formData.maNXB" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Mã tác giả</label>
          <input v-model="formData.maTacGia" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Tên thể loại</label>
          <input v-model="formData.tenTheLoai" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Ảnh bìa</label>
          <input
            type="file"
            @change="uploadImage"
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
        </div>

        <div class="text-center justify-content-between">
          <button class="btn btn-success w-25 mr-5" :disabled="uploading">
            <span
              v-if="uploading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Cập nhật
          </button>
          <button
            type="button"
            class="btn btn-secondary w-25 ml-5"
            @click="goBack"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import BookService from "@/services/book.service";

const route = useRoute();
const router = useRouter();
const bookId = route.params.id;

const formData = ref({
  tenSach: "",
  donGia: null,
  tongSoSach: null,
  soQuyenConLai: null,
  namXuatBan: null,
  maNXB: "",
  maTacGia: "",
  tenTheLoai: "",
  hinhAnh: "",
});

const uploading = ref(false);

onMounted(async () => {
  try {
    const book = await BookService.getById(bookId);
    formData.value = { ...book };
  } catch (err) {
    console.error("Lỗi khi tải sách:", err);
    Swal.fire("Lỗi", "Không thể tải thông tin sách.", "error");
  }
});

async function uploadImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;

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

    if (data.secure_url) {
      formData.value.hinhAnh = data.secure_url;
    } else {
      throw new Error(data.error?.message || "Lỗi không xác định");
    }
  } catch (err) {
    console.error("Lỗi upload ảnh:", err);
    Swal.fire("Lỗi", "Không thể tải ảnh lên.", "error");
  } finally {
    uploading.value = false;
  }
}

async function updateBook() {
  try {
    await BookService.update(bookId, formData.value);
    Swal.fire({
      icon: "success",
      title: "Đã cập nhật",
      text: "Thông tin sách đã được cập nhật.",
    });
    router.push({ name: "books" });
  } catch (err) {
    console.error("Lỗi khi cập nhật sách:", err);
    Swal.fire("Lỗi", "Không thể cập nhật sách.", "error");
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
