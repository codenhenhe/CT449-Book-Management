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
              {{ editingCategory ? "Cập nhật" : "Thêm" }} thể loại
            </h5>
            <button type="button" class="close" @click="$emit('close')">
              <span>&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label>Tên thể loại</label>
              <Field
                name="tenTheLoai"
                class="form-control"
                v-model="form.tenTheLoai"
              />
              <ErrorMessage name="tenTheLoai" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label>Mô tả</label>
              <textarea
                v-model="form.moTa"
                class="form-control"
                rows="3"
              ></textarea>
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
              {{ editingCategory ? "Cập nhật" : "Thêm" }}
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
import CategoryService from "@/services/category.service.js";

const props = defineProps({
  editingCategory: Object,
});
const emit = defineEmits(["close", "saved"]);

const form = reactive({
  tenTheLoai: "",
  moTa: "",
});

watch(
  () => props.editingCategory,
  (value) => {
    if (value) {
      Object.assign(form, value);
    } else {
      form.tenTheLoai = "";
      form.moTa = "";
    }
  },
  { immediate: true }
);

const schema = yup.object({
  tenTheLoai: yup.string().required("Vui lòng nhập tên thể loại"),
});

async function handleSubmit() {
  try {
    if (props.editingCategory) {
      await CategoryService.update(props.editingCategory._id, form);
      Swal.fire("Thành công", "Thể loại đã được cập nhật", "success");
    } else {
      await CategoryService.create(form);
      Swal.fire("Thành công", "Đã thêm thể loại mới", "success");
    }
    emit("saved");
    emit("close");
  } catch (err) {
    Swal.fire("Lỗi", err?.response?.data?.message || "Có lỗi xảy ra!", "error");
    console.error(err);
  }
}
</script>
