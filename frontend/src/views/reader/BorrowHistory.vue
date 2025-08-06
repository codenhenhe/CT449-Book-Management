<template>
  <div class="container">
    <h3 class="mb-4">📖 Lịch sử mượn sách</h3>

    <div v-if="borrows.length === 0" class="text-muted">
      Bạn chưa mượn sách nào.
    </div>

    <table v-else class="table table-bordered">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Ngày đặt</th>
          <th>Ngày lấy dự kiến</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in borrows" :key="item._id">
          <td>{{ item.maSach?.tenSach || "Không rõ" }}</td>
          <td>{{ formatDate(item.ngayDatSach) }}</td>
          <td>{{ formatDate(item.ngayLaySachDuKien) }}</td>
          <td>{{ formatStatus(item.trangThai) }}</td>
          <td>
            <button
              v-if="item.trangThai === 'cholay'"
              class="btn btn-danger btn-sm"
              @click="cancelBorrow(item)"
            >
              Huỷ mượn
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BorrowService from "@/services/borrow.service";
import Swal from "sweetalert2";

const borrows = ref([]);
const user = JSON.parse(localStorage.getItem("user") || "null");
user._id = user.id;

onMounted(async () => {
  if (!user?._id) return;
  borrows.value = await BorrowService.getByUser(user._id);
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatStatus(status) {
  switch (status) {
    case "cholay":
      return "📦 Chờ lấy";
    case "dalay":
      return "📘 Đã lấy";
    case "datra":
      return "✅ Đã trả";
    case "hethan":
      return "⏳ Hết hạn";
    case "dahuy":
      return "❌ Đã huỷ";
    default:
      return status;
  }
}

async function cancelBorrow(borrow) {
  const confirm = await Swal.fire({
    title: "Huỷ mượn sách?",
    text: `Bạn có chắc muốn huỷ lượt mượn: "${borrow.maSach?.tenSach}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Huỷ",
    cancelButtonText: "Giữ lại",
  });

  if (confirm.isConfirmed) {
    try {
      await BorrowService.cancel(borrow._id);
      borrows.value = borrows.value.map((b) =>
        b._id === borrow._id ? { ...b, trangThai: "dahuy" } : b
      );
      Swal.fire("✅ Đã huỷ!", "", "success");
    } catch (err) {
      Swal.fire("❌ Lỗi", "Không thể huỷ lượt mượn", "error");
    }
  }
}
</script>
