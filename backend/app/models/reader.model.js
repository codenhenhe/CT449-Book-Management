import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const { Schema, model } = mongoose;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 7);

const readerSchema = new Schema({
  maDocGia: {
    type: String,
    default: () => `DG${nanoid()}`,
    unique: true,
  },
  ten: {
    type: String,
    required: [true, "Vui lòng nhập tên"],
  },
  hoLot: {
    type: String,
    required: [true, "Vui lòng nhập họ tên đệm"],
  },
  ngaySinh: {
    type: Date,
    required: true,
  },
  phai: {
    type: Boolean,
    required: true,
  },
  diaChi: {
    type: String,
    required: true,
  },
  soDienThoai: {
    type: String,
    required: true,
    unique: true,
  },
  matKhau: {
    type: String,
    required: [true, "Vui lòng nhập mật khẩu"],
  },
  email: {
    type: String,
    required: true,
  },
  // anhDaiDien: {
  //   type: String,
  //   required: true,
  // },
  vaiTro: {
    type: String,
    // enum: ["docgia"],
    require: true,
  },
});
const Reader = model("Reader", readerSchema, "docgia");
export default Reader;
