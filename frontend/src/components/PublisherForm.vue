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
              {{ editingPublisher ? "Cập nhật" : "Thêm" }} nhà xuất bản
            </h5>
            <button type="button" class="close" @click="$emit('close')">
              <span>&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label>Tên nhà xuất bản</label>
              <Field name="tenNXB" class="form-control" v-model="form.tenNXB" />
              <ErrorMessage name="tenNXB" class="text-danger small" />
            </div>

            <div class="mb-3">
              <label>Địa chỉ</label>
              <textarea
                v-model="form.diaChi"
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
              {{ editingPublisher ? "Cập nhật" : "Thêm" }}
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
import PublisherService from "@/services/publisher.service.js";

const props = defineProps({
  editingPublisher: Object,
});
const emit = defineEmits(["close", "saved"]);

const form = reactive({
  tenNXB: "",
  diaChi: "",
});

watch(
  () => props.editingPublisher,
  (value) => {
    if (value) {
      Object.assign(form, value);
    } else {
      form.tenNXB = "";
      form.diaChi = "";
    }
  },
  { immediate: true }
);

const schema = yup.object({
  tenNXB: yup.string().required("Vui lòng nhập tên nhà xuất bản"),
});

async function handleSubmit() {
  try {
    if (props.editingPublisher) {
      await PublisherService.update(props.editingPublisher._id, form);
      Swal.fire("Thành công", "Nhà xuất bản đã được cập nhật", "success");
    } else {
      await PublisherService.create(form);
      Swal.fire("Thành công", "Đã thêm nhà xuất bản mới", "success");
    }
    emit("saved");
    emit("close");
  } catch (err) {
    Swal.fire("Lỗi", err?.response?.data?.message || "Có lỗi xảy ra!", "error");
    console.error(err);
  }
}
</script>
