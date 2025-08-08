<template>
  <div class="container mb-5">
    <h2 class="my-5 text-center">📚 Chào mừng bạn đến với Thư Viện Nhỏ</h2>

    <div class="filter-section mb-4 p-3 rounded shadow-sm">
      <div class="row align-items-center justify-content-between">
        <div class="col-lg-3 col-md-6 mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm sách theo tên..."
            v-model="searchTerm"
          />
        </div>
        <div class="col-lg-2 col-md-6 mb-2">
          <select class="form-select" v-model="filterAuthor">
            <option value="">Tác giả</option>
            <option
              v-for="author in uniqueAuthors"
              :key="author"
              :value="author"
            >
              {{ author }}
            </option>
          </select>
        </div>
        <div class="col-lg-2 col-md-6 mb-2">
          <select class="form-select" v-model="filterGenre">
            <option value="">Thể loại</option>
            <option v-for="genre in uniqueGenres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </div>
        <div class="col-lg-2 col-md-6 mb-2">
          <select class="form-select" v-model="filterPublisher">
            <option value="">Nhà xuất bản</option>
            <option
              v-for="publisher in uniquePublishers"
              :key="publisher"
              :value="publisher"
            >
              {{ publisher }}
            </option>
          </select>
        </div>
        <div class="col-lg-2 col-md-6 mb-2">
          <select class="form-select" v-model="filterYear">
            <option value="">Năm xuất bản</option>
            <option v-for="year in uniqueYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="d-flex mb-3 justify-content-between align-items-center">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="filterAvailable"
          id="availableBooks"
        />
        <label class="form-check-label" for="availableBooks">
          Chỉ hiển thị sách còn
        </label>
      </div>

      <button
        class="btn btn-success"
        style="min-width: 150px"
        @click="goToAddBook"
        v-if="user?.vaiTro === 'nhanvien' || user?.vaiTro === 'quantrivien'"
      >
        <i class="fa-solid fa-plus"></i> Thêm sách
      </button>
    </div>

    <div v-if="filteredBooks.length === 0" class="text-center text-muted">
      Không có sách nào để hiển thị.
    </div>

    <div class="row">
      <div
        class="col-lg-3 col-md-4 col-sm-6 mb-4"
        v-for="book in filteredBooks"
        :key="book._id"
      >
        <div class="card h-100 shadow-sm book-card">
          <img
            :src="
              book.hinhAnh ||
              'https://dummyimage.com/300x200/cccccc/000000&text=No+Image'
            "
            class="card-img-top book-cover"
            alt="Ảnh bìa sách"
          />
          <div class="card-body d-flex flex-column p-3">
            <h6 class="card-title text-truncate mb-2 p-2 text-center">
              {{ book.tenSach }}
            </h6>
            <div class="book-info">
              <p class="card-text mb-1">
                <i class="fas fa-tag"></i> Thể loại: {{ book.tenTheLoai }}
              </p>
              <p class="card-text mb-1">
                <i class="fas fa-user-edit"></i> Tác giả:
                {{ book.maTacGia?.tenTacGia || "Không rõ" }}
              </p>
              <p class="card-text mb-1">
                <i class="fas fa-building"></i> NXB:
                {{ book.maNXB?.tenNXB || "Không rõ" }}
              </p>
              <p class="card-text mb-1">
                <i class="fas fa-calendar-alt"></i> Năm xuất bản:
                {{ book.namXuatBan }}
              </p>
              <p class="card-text mb-1 text-success fw-bold">
                <i class="fas fa-bookmark"></i> Còn: {{ book.soQuyenConLai }}
              </p>
            </div>
          </div>
          <div class="card-footer bg-white border-0 text-center">
            <button
              class="btn btn-primary btn-sm w-100 mb-2"
              @click="handleBorrow(book)"
            >
              <i class="fas fa-cart-plus"></i> Mượn sách
            </button>
            <div
              v-if="
                user?.vaiTro === 'nhanvien' || user?.vaiTro === 'quantrivien'
              "
              class="d-flex justify-content-between"
            >
              <button
                class="btn btn-warning btn-sm flex-grow-1 mr-1"
                @click="editBook(book)"
              >
                <i class="fas fa-edit"></i> Sửa
              </button>
              <button
                class="btn btn-danger btn-sm flex-grow-1 ml-1"
                @click="confirmDelete(book)"
              >
                <i class="fas fa-trash-alt"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";

const books = ref([]);
const searchTerm = ref("");
const filterAuthor = ref("");
const filterPublisher = ref("");
const filterYear = ref("");
const filterGenre = ref("");
const filterAvailable = ref(false);
const router = useRouter();
const user = JSON.parse(localStorage.getItem("user") || "null");

const uniqueAuthors = computed(() => {
  const authors = books.value
    .map((book) => book.maTacGia?.tenTacGia)
    .filter(Boolean);
  return [...new Set(authors)];
});

const uniquePublishers = computed(() => {
  const publishers = books.value
    .map((book) => book.maNXB?.tenNXB)
    .filter(Boolean);
  return [...new Set(publishers)];
});

const uniqueYears = computed(() => {
  const years = books.value.map((book) => book.namXuatBan).filter(Boolean);
  return [...new Set(years)].sort((a, b) => b - a);
});

const uniqueGenres = computed(() => {
  const genres = books.value.map((book) => book.tenTheLoai).filter(Boolean);
  return [...new Set(genres)];
});

const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const matchesSearchTerm = book.tenSach
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    const matchesAuthor =
      !filterAuthor.value || book.maTacGia?.tenTacGia === filterAuthor.value;
    const matchesPublisher =
      !filterPublisher.value || book.maNXB?.tenNXB === filterPublisher.value;
    const matchesYear =
      !filterYear.value || book.namXuatBan === parseInt(filterYear.value);
    const matchesGenre =
      !filterGenre.value || book.tenTheLoai === filterGenre.value;
    const matchesAvailable = !filterAvailable.value || book.soQuyenConLai > 0;

    return (
      matchesSearchTerm &&
      matchesAuthor &&
      matchesPublisher &&
      matchesYear &&
      matchesGenre &&
      matchesAvailable
    );
  });
});

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
.filter-section {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.book-card {
  min-height: 230px;
  transition: transform 0.2s ease-in-out;
}
.book-card:hover {
  transform: translateY(-5px);
}
.book-cover {
  object-fit: contain;
  height: 150px;
  padding: 10px;
}
.card-body h6 {
  font-size: 1rem;
  font-weight: bold;
}
.book-info p {
  font-size: 0.85rem;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-info i {
  width: 20px;
  text-align: center;
  color: #0d6efd;
}
.btn-sm {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}
</style>
