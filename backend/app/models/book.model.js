import mongoose from "mongoose";
import Publisher from "./publisher.model.js";
import Author from "./author.model.js";
import Category from "./category.model.js";

import { customAlphabet } from "nanoid";

const { Schema, model } = mongoose;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 7);

const bookSchema = new Schema({
  maSach: {
    type: String,
    default: () => `MS${nanoid()}`,
    unique: true,
  },
  tenSach: {
    type: String,
    required: [true, "Vui lòng nhập tên sách"],
  },
  donGia: {
    type: Number,
    required: true,
  },
  tongSoSach: {
    type: Number,
    required: true,
  },
  soQuyenConLai: {
    type: Number,
    required: true,
  },
  namXuatBan: {
    type: Number,
    required: true,
  },
  maNXB: {
    type: Schema.Types.ObjectId,
    ref: Publisher,
    required: false,
  },
  maTacGia: {
    type: String,
    ref: Author,
    required: false,
  },
  tenTheLoai: {
    type: String,
    ref: Category,
    required: false,
  },
  hinhAnh: {
    type: String,
    required: false,
  },
});
const Book = model("Book", bookSchema, "sach");
export default Book;
