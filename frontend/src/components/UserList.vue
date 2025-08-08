<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Danh sách {{ userTypeDisplay }}</h4>
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    <div v-else-if="users.length === 0" class="alert alert-info text-center">
      Chưa có {{ userTypeDisplay }} nào.
    </div>
    <table v-else class="table table-hover shadow-sm rounded overflow-hidden">
      <thead class="bg-primary text-white">
        <tr>
          <th>Mã {{ userTypeDisplay }}</th>
          <th>Tên {{ userTypeDisplay }}</th>
          <th>Email</th>
          <th>Số điện thoại</th>
          <th>Giới tính</th>
          <th>Ngày sinh</th>
          <th class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in displayUsers" :key="user._id">
          <td>{{ user.displayMa }}</td>
          <td>{{ user.displayName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.soDienThoai }}</td>
          <td>{{ user.gioiTinh }}</td>
          <td>{{ user.ngaySinh }}</td>
          <td class="text-center">
            <button
              @click="editUser(user._id)"
              class="btn btn-warning btn-sm mr-2"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(user)" class="btn btn-danger btn-sm">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import AdminService from "@/services/admin.service";

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["refresh"]);
const router = useRouter();

// Dùng computed để hiển thị tên vai trò một cách rõ ràng
const userTypeDisplay = computed(() => {
  switch (props.userType) {
    case "readers":
      return "Đọc giả";
    case "staffs":
      return "Nhân viên";
    default:
      return "Người dùng";
  }
});

// Computed property để chuẩn hóa dữ liệu hiển thị
const displayUsers = computed(() => {
  if (!props.users) {
    return [];
  }
  return props.users.map((user) => {
    let displayMa;
    let displayName;
    let gioiTinh = user.phai ? "Nữ" : "Nam"; // Chuyển đổi boolean thành chuỗi
    let ngaySinh = user.ngaySinh
      ? new Date(user.ngaySinh).toLocaleDateString("vi-VN")
      : ""; // Định dạng ngày sinh

    if (props.userType === "readers") {
      displayMa = user.maDocGia;
      displayName = user.hoLot ? `${user.hoLot} ${user.ten}` : user.ten;
    } else {
      displayMa = user.maNhanVien;
      displayName = user.hoLot ? `${user.hoLot} ${user.ten}` : user.ten;
    }
    return {
      ...user,
      displayMa,
      displayName,
      soDienThoai: user.soDienThoai,
      gioiTinh: gioiTinh,
      ngaySinh: ngaySinh,
    };
  });
});

function editUser(userId) {
  let role;
  if (props.userType === "readers") {
    role = "docgia";
  } else if (props.userType === "staffs") {
    role = "nhanvien";
  }
  router.push({
    name: "quantrivien.users.edit",
    params: { id: userId },
    query: { role },
  });
}

// Hàm xác nhận xóa
async function confirmDelete(user) {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: `Bạn sắp xóa người dùng "${user.displayName}". Thao tác này không thể hoàn tác!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    await deleteUser(user._id);
  }
}

// Hàm xóa người dùng, gọi đúng service dựa trên userType
async function deleteUser(userId) {
  try {
    if (props.userType === "readers") {
      await AdminService.deleteReader(userId);
    } else if (props.userType === "staffs") {
      await AdminService.deleteStaff(userId);
    }
    Swal.fire("Đã xóa!", "Người dùng đã được xóa thành công.", "success");
    emit("refresh");
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    Swal.fire("Lỗi", "Không thể xóa người dùng.", "error");
  }
}
</script>
