<template>
  <div class="container py-4">
    <h3 class="mb-4">Quản lý đơn mượn sách</h3>

    <div class="mb-3">
      <label>Lọc theo trạng thái:</label>
      <select
        v-model="filterStatus"
        class="form-select w-auto d-inline-block ml-2"
        @change="filter"
      >
        <option value="">Tất cả</option>
        <option value="cholay">Chờ lấy</option>
        <option value="dalay">Đã lấy</option>
        <option value="datra">Đã trả</option>
        <option value="hethan">Hết hạn</option>
        <option value="dahuy">Đã huỷ</option>
      </select>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr class="text-center">
          <th>Đọc giả</th>
          <th>Sách</th>
          <th>Ngày mượn</th>
          <th>Ngày lấy sách dự kiến</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="borrow in filteredBorrows"
          :key="borrow._id"
          class="text-center"
        >
          <td>
            {{
              borrow.maDocGia
                ? borrow.maDocGia.maDocGia +
                  " - " +
                  borrow.maDocGia.hoLot +
                  " " +
                  borrow.maDocGia.ten
                : "?"
            }}
          </td>
          <td>
            {{
              borrow.maSach
                ? borrow.maSach.maSach + " - " + borrow.maSach.tenSach
                : "?"
            }}
          </td>
          <td>{{ formatDate(borrow.ngayDatSach) }}</td>
          <td>{{ formatDate(borrow.ngayLaySachDuKien) }}</td>
          <td>{{ formatStatus(borrow.trangThai) }}</td>
          <td>
            <button
              v-if="borrow.trangThai === 'cholay'"
              class="btn btn-success btn-sm mr-2"
              @click="changeStatus(borrow, 'dalay')"
            >
              Xác nhận đã lấy
            </button>
            <button
              v-if="borrow.trangThai === 'dalay'"
              class="btn btn-info btn-sm mr-2"
              @click="changeStatus(borrow, 'datra')"
            >
              Xác nhận đã trả
            </button>
            <button
              v-if="
                borrow.trangThai !== 'datra' && borrow.trangThai !== 'dahuy'
              "
              class="btn btn-danger btn-sm my-2"
              @click="changeStatus(borrow, 'dahuy')"
            >
              Huỷ
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import BorrowService from "@/services/borrow.service";

export default {
  data() {
    return {
      borrows: [],
      filterStatus: "",
    };
  },
  computed: {
    filteredBorrows() {
      const sorted = [...this.borrows].sort((a, b) => {
        return new Date(b.ngayDatSach) - new Date(a.ngayDatSach);
      });

      if (!this.filterStatus) return sorted;
      return sorted.filter((b) => b.trangThai === this.filterStatus);
    },
  },
  methods: {
    async load() {
      try {
        const result = await BorrowService.getAll();
        this.borrows = result;
      } catch (err) {
        console.error("Lỗi tải danh sách:", err);
        Swal.fire("Lỗi", "Không thể tải danh sách đơn mượn!", "error");
      }
    },

    async changeStatus(borrow, newStatus) {
      const confirmText = {
        dalay: "Bạn có chắc muốn xác nhận đã lấy sách?",
        datra: "Xác nhận đọc giả đã trả sách?",
        dahuy: "Bạn có chắc muốn huỷ đơn mượn này?",
      };

      const result = await Swal.fire({
        title: "Xác nhận",
        text: confirmText[newStatus] || "Bạn có chắc không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Huỷ",
      });

      if (result.isConfirmed) {
        try {
          await BorrowService.updateStatus(borrow._id, {
            trangThai: newStatus,
          });
          Swal.fire("Thành công", "Cập nhật trạng thái thành công.", "success");
          this.load();
        } catch (err) {
          console.error(err);
          Swal.fire("Lỗi", "Không thể cập nhật trạng thái.", "error");
        }
      }
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },

    filter() {},

    formatStatus(status) {
      switch (status) {
        case "cholay":
          return "Chờ lấy";
        case "dalay":
          return "Đã lấy";
        case "datra":
          return "Đã trả";
        case "hethan":
          return "Hết hạn";
        case "dahuy":
          return "Đã huỷ";
        default:
          return status;
      }
    },
  },

  mounted() {
    this.load();
  },
};
</script>
