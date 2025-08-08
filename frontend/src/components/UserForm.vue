<template>
  <div class="user-form container mt-5">
    <div class="card p-4 shadow-lg w-100 mx-auto" style="max-width: 600px">
      <h2 class="card-title text-center mb-4 fw-bold text-primary">
        ✏️ Sửa Thông Tin Người Dùng
      </h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="tenDangNhap" class="form-label fw-bold"
            >Mã đăng nhập *</label
          >
          <input
            v-model="formData.tenDangNhap"
            id="tenDangNhap"
            class="form-control"
            required
            disabled
            autocomplete="off"
          />
        </div>
        <div class="mb-3">
          <label for="hoTen" class="form-label fw-bold">Họ và tên *</label>
          <input
            v-model="formData.hoTen"
            id="hoTen"
            class="form-control"
            required
            autocomplete="name"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label fw-bold">Email *</label>
          <input
            v-model="formData.email"
            id="email"
            type="email"
            class="form-control"
            required
            autocomplete="off"
          />
        </div>
        <div class="mb-3">
          <label for="soDienThoai" class="form-label fw-bold"
            >Số điện thoại</label
          >
          <input
            v-model="formData.soDienThoai"
            id="soDienThoai"
            type="tel"
            class="form-control"
            autocomplete="tel"
          />
        </div>
        <div class="mb-3">
          <label for="phai" class="form-label fw-bold">Giới tính</label>
          <select
            v-model="formData.phai"
            id="phai"
            class="form-select"
            autocomplete="sex"
          >
            <option :value="true">Nữ</option>
            <option :value="false">Nam</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="ngaySinh" class="form-label fw-bold">Ngày sinh</label>
          <input
            v-model="formData.ngaySinh"
            id="ngaySinh"
            type="date"
            class="form-control"
            autocomplete="bday"
          />
        </div>
        <div class="mb-3">
          <label for="matKhau" class="form-label fw-bold">Mật khẩu mới</label>
          <input
            v-model="formData.matKhau"
            id="matKhau"
            type="password"
            class="form-control"
            autocomplete="new-password"
          />
        </div>
        <div class="mb-3">
          <label for="vaiTro" class="form-label fw-bold">Vai trò *</label>
          <select
            v-model="formData.vaiTro"
            id="vaiTro"
            class="form-select"
            required
            disabled
          >
            <option value="docgia">Đọc giả</option>
            <option value="nhanvien">Nhân viên</option>
          </select>
        </div>
        <div class="d-flex justify-content-center gap-3 mt-4">
          <button
            type="submit"
            class="btn btn-primary btn-lg mr-3"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm mr-2"
            ></span>
            <i v-else class="fas mr-2 fa-save"></i>
            Cập nhật
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-lg ms-3"
            @click="goBack"
          >
            <i class="fas fa-arrow-left mr-2"></i> Quay lại
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
import AdminService from "@/services/admin.service";

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const formData = ref({
  tenDangNhap: "",
  hoTen: "",
  email: "",
  soDienThoai: "",
  phai: false, // false = Nam, true = Nữ
  ngaySinh: "",
  matKhau: "",
  vaiTro: "docgia",
});

// onMounted giờ đây chỉ cần tải thông tin người dùng
onMounted(async () => {
  const userId = route.params.id;
  if (userId) {
    await fetchUser(userId);
  } else {
    // Nếu không có userId, chuyển hướng về trang danh sách vì form chỉ dùng để chỉnh sửa
    router.push({ name: "quantrivien.users" });
  }
});

async function fetchUser(userId) {
  try {
    loading.value = true;
    const role = route.query.role;
    let user;
    if (role === "docgia") {
      user = await AdminService.getReaderById(userId);
      formData.value = {
        tenDangNhap: user.maDocGia,
        hoTen: user.hoLot ? `${user.hoLot} ${user.ten}` : user.ten,
        email: user.email,
        soDienThoai: user.soDienThoai || "",
        phai: user.phai,
        ngaySinh: user.ngaySinh
          ? new Date(user.ngaySinh).toISOString().slice(0, 10)
          : "",
        matKhau: "",
        vaiTro: role,
      };
    } else if (role === "nhanvien" || role === "quantrivien") {
      user = await AdminService.getStaffById(userId);
      console.log("Dữ liệu nhân viên:", user);
      formData.value = {
        tenDangNhap: user.maNhanVien,
        hoTen: user.hoLot ? `${user.hoLot} ${user.ten}` : user.ten,
        email: user.email,
        soDienThoai: user.soDienThoai || "",
        phai: user.phai,
        ngaySinh: user.ngaySinh
          ? new Date(user.ngaySinh).toISOString().slice(0, 10)
          : "",
        matKhau: "",
        vaiTro: role,
      };
    } else {
      throw new Error("Vai trò người dùng không xác định");
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin người dùng:", error);
    Swal.fire("Lỗi", "Không thể tải thông tin người dùng.", "error");
    router.push({ name: "quantrivien.users" });
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    // Chỉ gọi hàm updateUser vì chức năng thêm đã bị bỏ
    await updateUser();
  } catch (error) {
    console.error("Lỗi:", error);
    Swal.fire(
      "Lỗi",
      error.message || "Đã xảy ra lỗi không mong muốn.",
      "error"
    );
  } finally {
    loading.value = false;
  }
}

async function updateUser() {
  try {
    const role = route.query.role;
    const payload = {
      email: formData.value.email,
      phai: formData.value.phai,
    };
    if (formData.value.matKhau) {
      payload.matKhau = formData.value.matKhau;
    }
    if (formData.value.soDienThoai) {
      payload.soDienThoai = formData.value.soDienThoai;
    }
    if (formData.value.ngaySinh) {
      payload.ngaySinh = formData.value.ngaySinh;
    }

    if (role === "docgia") {
      const hoTenParts = formData.value.hoTen.split(" ");
      payload.ten = hoTenParts.pop();
      payload.hoLot = hoTenParts.join(" ");
      await AdminService.updateReader(route.params.id, payload);
    } else if (role === "nhanvien" || role === "quantrivien") {
      payload.hoTen = formData.value.hoTen;
      await AdminService.updateStaff(route.params.id, payload);
    } else {
      throw new Error("Vai trò người dùng không xác định");
    }

    Swal.fire(
      "Thành công!",
      "Thông tin người dùng đã được cập nhật.",
      "success"
    ).then(() => {
      router.push({ name: "quantrivien.users" });
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    Swal.fire(
      "Lỗi",
      "Không thể cập nhật người dùng. Vui lòng kiểm tra lại thông tin.",
      "error"
    );
  }
}

function goBack() {
  router.back();
}
</script>
