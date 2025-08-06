<template>
  <div class="container mb-5">
    <h2 class="my-5 text-center">📚 Chào mừng bạn đến với Thư Viện Nhỏ</h2>

    <div
      class="d-flex mb-3 justify-content-end"
      v-if="user?.vaiTro === 'nhanvien' || user?.vaiTro === 'quantrivien'"
    >
      <button
        class="btn btn-success"
        style="min-width: 150px"
        @click="goToAddBook"
      >
        <i class="fa-solid fa-plus"></i> Thêm sách
      </button>
    </div>

    <div v-if="books.length === 0" class="text-center text-muted">
      Không có sách nào để hiển thị.
    </div>

    <div class="row">
      <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
        <div class="card h-100 shadow-sm">
          <!-- Ảnh bìa -->
          <img
            :src="
              book.hinhAnh ||
              'https://dummyimage.com/300x200/cccccc/000000&text=No+Image'
            "
            class="card-img-top book-cover"
            alt="Ảnh bìa sách"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Tên sách: {{ book.tenSach }}</h5>
            <p class="card-text">Thể loại: {{ book.tenTheLoai }}</p>
            <p class="card-text">Mã tác giả: {{ book.maTacGia }}</p>
            <p class="card-text">Đơn giá: {{ book.donGia }}</p>
            <!-- <p class="card-text">Tổng số sách: {{ book.tongSoSach }}</p> -->
            <p class="card-text">Số lượng còn lại: {{ book.soQuyenConLai }}</p>
            <p class="card-text">Năm xuất bản: {{ book.namXuatBan }}</p>

            <div class="mt-auto d-flex justify-content-center flex-wrap">
              <button
                class="btn btn-primary mx-1 mb-2"
                style="min-width: 250px"
                @click="handleBorrow(book)"
              >
                Mượn sách
              </button>
              <button
                v-if="
                  user?.vaiTro === 'nhanvien' || user?.vaiTro === 'quantrivien'
                "
                class="btn btn-warning mx-1 mb-2"
                style="min-width: 250px"
                @click="editBook(book)"
              >
                Sửa
              </button>
              <button
                v-if="
                  user?.vaiTro === 'nhanvien' || user?.vaiTro === 'quantrivien'
                "
                class="btn btn-danger mx-1 mb-2"
                style="min-width: 250px"
                @click="confirmDelete(book)"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <router-view /> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import BookService from "@/services/book.service";

const books = ref([]);
const router = useRouter();
const user = JSON.parse(localStorage.getItem("user") || "null");

onMounted(async () => {
  try {
    books.value = await BookService.getAll();
  } catch (err) {
    console.error("Lỗi khi tải danh sách sách:", err);
    Swal.fire("Lỗi", "Không thể tải danh sách sách.", "error");
  }
});

function handleBorrow(book) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user || user.vaiTro !== "docgia") {
    Swal.fire({
      icon: "info",
      title: "Cần đăng nhập",
      text: "Bạn cần đăng nhập với vai trò đọc giả để mượn sách.",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: "login" });
      }
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Đã chọn mượn",
    text: `📚 Bạn đã chọn mượn sách: ${book.tenSach}`,
  });

  // TODO: Gọi API mượn sách tại đây nếu cần
}

async function confirmDelete(book) {
  const result = await Swal.fire({
    title: "Bạn có chắc muốn xóa?",
    text: `Sách "${book.tenSach}" sẽ bị xóa vĩnh viễn.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    await deleteBook(book._id);
  }
}

async function deleteBook(bookId) {
  try {
    await BookService.delete(bookId);
    books.value = books.value.filter((b) => b._id !== bookId);

    Swal.fire({
      icon: "success",
      title: "Đã xóa!",
      text: "Sách đã được xóa thành công.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Lỗi khi xóa sách:", err);
    Swal.fire("Lỗi", "Không thể xóa sách. Vui lòng thử lại.", "error");
  }
}

function editBook(book) {
  router.push({ name: "books.edit", params: { id: book._id } });
}

function goToAddBook() {
  router.push({ name: "books.add" });
}
</script>

<style scoped>
.card {
  min-height: 230px;
}
.book-cover {
  object-fit: contain;
  height: 200px;
}
.d-flex {
  display: flex !important;
}
.btn {
  flex-grow: 1;
  max-width: 120px;
}
</style>
