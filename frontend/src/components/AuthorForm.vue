<!-- src/components/AuthorForm.vue -->
<template>
  <div
    class="modal d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <Form @submit="handleSubmit" :validation-schema="schema">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingAuthor ? "Cập nhật" : "Thêm" }} tác giả
            </h5>
            <!-- Nút đóng (Bootstrap 4) -->
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="$emit('close')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label>Tên tác giả</label>
              <Field
                name="tenTacGia"
                class="form-control"
                :value="form.tenTacGia"
                @input="form.tenTacGia = $event"
              />
              <ErrorMessage name="tenTacGia" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label>Quốc tịch</label>
              <input v-model="form.quocTich" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Ngày sinh</label>
              <input v-model="form.ngaySinh" type="date" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Phái</label>
              <select v-model="form.phai" class="form-control">
                <option :value="true">Nam</option>
                <option :value="false">Nữ</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
            >
              Huỷ
            </button>
            <button class="btn btn-primary" type="submit">
              {{ editingAuthor ? "Cập nhật" : "Thêm" }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import AuthorService from "@/services/author.service.js";

const props = defineProps({
  editingAuthor: Object,
});
const emit = defineEmits(["close", "saved"]);

const form = reactive({
  tenTacGia: "",
  quocTich: "",
  ngaySinh: "",
  phai: null,
});

watch(
  () => props.editingAuthor,
  (value) => {
    if (value) {
      Object.assign(form, value);
      if (form.ngaySinh) {
        form.ngaySinh = new Date(form.ngaySinh).toISOString().split("T")[0];
      }
    } else {
      form.tenTacGia = "";
      form.quocTich = "";
      form.ngaySinh = "";
      form.phai = null;
    }
  },
  { immediate: true }
);

const schema = yup.object({
  tenTacGia: yup.string().required("Tên tác giả không được để trống"),
});

async function handleSubmit() {
  try {
    if (props.editingAuthor) {
      await AuthorService.update(props.editingAuthor._id, form);
      Swal.fire("Thành công", "Cập nhật tác giả thành công!", "success");
    } else {
      await AuthorService.create(form);
      Swal.fire("Thành công", "Thêm tác giả thành công!", "success");
    }
    emit("saved");
    emit("close");
  } catch (err) {
    Swal.fire("Lỗi", "Đã xảy ra lỗi khi lưu tác giả!", "error");
    console.error(err);
  }
}
</script>
