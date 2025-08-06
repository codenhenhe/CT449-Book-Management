<template>
  <div class="container py-4">
    <h3 class="mb-4">Quản lý Nhà xuất bản</h3>

    <!-- Button Thêm mới -->
    <button class="btn btn-primary mb-3" @click="openAddModal">
      Thêm nhà xuất bản
    </button>

    <!-- Bảng danh sách nhà xuất bản -->
    <table class="table table-bordered table-hover" v-if="publishers.length">
      <thead class="table-dark text-center">
        <tr>
          <th style="width: 20%">Mã NXB</th>
          <th style="width: 30%">Tên NXB</th>
          <th style="width: 30%">Địa chỉ</th>
          <th style="width: 20%">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pub in publishers" :key="pub._id">
          <td>{{ pub.maNXB }}</td>
          <td>{{ pub.tenNXB }}</td>
          <td>{{ pub.diaChi || "---" }}</td>
          <td class="text-center">
            <button
              class="btn btn-sm btn-warning mr-2"
              @click="editPublisher(pub)"
            >
              Sửa
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="confirmDelete(pub._id)"
            >
              Xoá
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-muted">Không có nhà xuất bản nào.</div>

    <!-- Modal thêm/sửa -->
    <PublisherForm
      v-if="showForm"
      :editing-publisher="selectedPublisher"
      @close="showForm = false"
      @saved="fetchPublishers"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import PublisherService from "@/services/publisher.service";
import PublisherForm from "@/components/PublisherForm.vue"; // Component form cần tạo

const publishers = ref([]);
const showForm = ref(false);
const selectedPublisher = ref(null);

function fetchPublishers() {
  PublisherService.getAll()
    .then((res) => (publishers.value = res))
    .catch(() =>
      Swal.fire("Lỗi", "Không thể tải danh sách nhà xuất bản", "error")
    );
}

function openAddModal() {
  selectedPublisher.value = null;
  showForm.value = true;
}

function editPublisher(pub) {
  selectedPublisher.value = { ...pub };
  showForm.value = true;
}

async function confirmDelete(id) {
  const result = await Swal.fire({
    title: "Xác nhận xoá?",
    text: "Nhà xuất bản này sẽ bị xoá vĩnh viễn.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  });

  if (result.isConfirmed) {
    try {
      await PublisherService.delete(id);
      fetchPublishers();
      Swal.fire("Thành công", "Nhà xuất bản đã được xoá.", "success");
    } catch {
      Swal.fire("Lỗi", "Không thể xoá nhà xuất bản.", "error");
    }
  }
}

onMounted(fetchPublishers);
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
