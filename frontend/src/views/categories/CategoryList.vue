<template>
  <div class="container py-4">
    <h3 class="mb-4">Quản lý Thể loại sách</h3>

    <!-- Button Thêm mới -->
    <button class="btn btn-primary mb-3" @click="openAddModal">
      Thêm thể loại
    </button>

    <!-- Bảng danh sách thể loại -->
    <table class="table table-bordered table-hover" v-if="categories.length">
      <thead class="table-dark text-center">
        <tr>
          <th style="width: 30%">Tên thể loại</th>
          <th style="width: 50%">Mô tả</th>
          <th style="width: 20%">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.tenTheLoai }}</td>
          <td>{{ cat.moTa || "---" }}</td>
          <td class="text-center">
            <button
              class="btn btn-sm btn-warning mr-2"
              @click="editCategory(cat)"
            >
              Sửa
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="confirmDelete(cat._id)"
            >
              Xoá
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-muted">Không có thể loại nào.</div>

    <!-- Modal thêm/sửa -->
    <CategoryForm
      v-if="showForm"
      :editing-category="selectedCategory"
      @close="showForm = false"
      @saved="fetchCategories"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import CategoryService from "@/services/category.service";
import CategoryForm from "@/components/CategoryForm.vue"; // Cần có component này

const categories = ref([]);
const showForm = ref(false);
const selectedCategory = ref(null);

function fetchCategories() {
  CategoryService.getAll()
    .then((res) => (categories.value = res))
    .catch(() => Swal.fire("Lỗi", "Không thể tải danh sách thể loại", "error"));
}

function openAddModal() {
  selectedCategory.value = null;
  showForm.value = true;
}

function editCategory(cat) {
  selectedCategory.value = { ...cat };
  showForm.value = true;
}

async function confirmDelete(id) {
  const result = await Swal.fire({
    title: "Xác nhận xoá?",
    text: "Thể loại này sẽ bị xoá vĩnh viễn.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  });

  if (result.isConfirmed) {
    try {
      await CategoryService.delete(id);
      fetchCategories();
      Swal.fire("Thành công", "Thể loại đã được xoá.", "success");
    } catch {
      Swal.fire("Lỗi", "Không thể xoá thể loại.", "error");
    }
  }
}

onMounted(fetchCategories);
</script>

<style scoped>
th,
td {
  vertical-align: middle;
  word-wrap: break-word;
  white-space: normal;
}

table {
  table-layout: fixed;
  width: 100%;
}

.btn-sm {
  padding: 7px 20px;
  font-size: 0.9rem;
  min-width: 60px;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
