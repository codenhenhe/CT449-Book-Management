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
            <p class="card-text">
              Tác giả: {{ book.maTacGia?.tenTacGia || "Không rõ" }}
            </p>
            <p class="card-text">Đơn giá: {{ book.donGia }}</p>
            <!-- <p class="card-text">Tổng số sách: {{ book.tongSoSach }}</p> -->
            <p class="card-text">Số lượng còn lại: {{ book.soQuyenConLai }}</p>
            <p class="card-text">
              Nhà xuất bản: {{ book.maNXB?.tenNXB || "Không rõ" }}
            </p>
            <p class="card-text">Năm xuất bản: {{ book.namXuatBan }}</p>

            <div class="mt-auto d-flex justify-content-center flex-wrap">
              <button
                class="btn btn-primary mx-1 mb-2"
                style="min-width: 300px"
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
import BorrowService from "@/services/borrow.service";

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

async function handleBorrow(book) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user || user.vaiTro !== "docgia") {
    Swal.fire({
      icon: "info",
      title: "Cần đăng nhập",
      text: "Vui lòng đăng nhập với vai trò đọc giả.",
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

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 4);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const { value: formValues } = await Swal.fire({
    title: `📅 Mượn sách: ${book.tenSach}`,
    width: "700px",
    html: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label for="pickupDate" style="display: block; margin-bottom: 5px;">Ngày lấy sách (trong vòng 4 ngày):</label>
          <input type="date" id="pickupDate" class="swal2-input" min="${todayStr}" max="${maxDateStr}" value="${todayStr}" required>
        </div>
        <div>
          <label for="note" style="display: block; margin-bottom: 5px;">Ghi chú (tuỳ chọn):</label>
          <textarea id="note" class="swal2-textarea" placeholder="Nhập ghi chú..." style="min-height: 100px; width: 90%;"></textarea>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
    preConfirm: () => {
      const pickupDateStr = document.getElementById("pickupDate").value;
      const note = document.getElementById("note").value;

      if (!pickupDateStr) {
        Swal.showValidationMessage("Vui lòng chọn ngày lấy sách.");
        return false;
      }

      const pickupDate = new Date(pickupDateStr);
      const dayOfWeek = pickupDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        Swal.showValidationMessage("Không chọn Thứ 7 hoặc Chủ nhật.");
        return false;
      }

      return { pickupDate: pickupDateStr, note };
    },
  });

  if (!formValues) return;

  try {
    const data = {
      maDocGia: user.id,
      maSach: book._id,
      ngayDatSach: today,
      ngayLaySachDuKien: new Date(formValues.pickupDate),
      ghiChu: formValues.note,
    };

    await BorrowService.create(data);

    Swal.fire({
      icon: "success",
      title: "Đặt mượn thành công",
      text: `📚 ${book.tenSach}`,
    });

    book.soQuyenConLai -= 1;
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: err?.response?.data?.message || "Không thể mượn sách.",
    });
  }
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
