<template>
  <div class="container py-4">
    <h3 class="mb-4">Quản lý Tác giả</h3>

    <!-- Button Thêm mới -->
    <button class="btn btn-primary mb-3" @click="openAddModal">
      Thêm tác giả
    </button>

    <!-- Table danh sách -->
    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th>Mã</th>
          <th>Tên tác giả</th>
          <th>Quốc tịch</th>
          <th>Ngày sinh</th>
          <th>Giới tính</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author._id">
          <td>{{ author.maTacGia }}</td>
          <td>{{ author.tenTacGia }}</td>
          <td>{{ author.quocTich || "-" }}</td>
          <td>{{ author.ngaySinh ? formatDate(author.ngaySinh) : "-" }}</td>
          <td>
            {{
              author.phai === true ? "Nam" : author.phai === false ? "Nữ" : "-"
            }}
          </td>
          <td>
            <button
              class="btn btn-sm btn-warning mr-2"
              @click="editAuthor(author)"
            >
              Sửa
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteAuthor(author._id)"
            >
              Xoá
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal thêm/sửa -->
    <AuthorForm
      v-if="showForm"
      :editing-author="selectedAuthor"
      @close="showForm = false"
      @saved="fetchAuthors"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import AuthorService from "@/services/author.service.js";
import AuthorForm from "@/components/AuthorForm.vue";

const authors = ref([]);
const showForm = ref(false);
const selectedAuthor = ref(null);

function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN");
}

function fetchAuthors() {
  AuthorService.getAll().then((authorsList) => {
    authors.value = authorsList;
  });
}

function openAddModal() {
  selectedAuthor.value = null;
  showForm.value = true;
}

function editAuthor(author) {
  selectedAuthor.value = { ...author };
  showForm.value = true;
}

function deleteAuthor(id) {
  Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Thao tác này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      AuthorService.delete(id)
        .then(() => {
          Swal.fire("Đã xoá!", "Tác giả đã được xoá.", "success");
          fetchAuthors();
        })
        .catch((err) => {
          console.error(err);
          Swal.fire("Lỗi", "Không thể xoá tác giả!", "error");
        });
    }
  });
}

onMounted(fetchAuthors);
</script>
