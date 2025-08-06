import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const { Schema, model } = mongoose;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 7);

const authorSchema = new Schema({
  maTacGia: {
    type: String,
    default: () => `TG${nanoid()}`,
    required: true,
  },
  tenTacGia: {
    type: String,
    required: [true, "Vui lòng nhập tên tác giả"],
  },
  quocTich: {
    type: String,
    required: false,
  },
  ngaySinh: {
    type: Date,
    required: false,
  },
  phai: {
    type: Boolean, // Male: true, female: false
    required: false,
  },
});
const Author = model("Author", authorSchema, "tacgia");
export default Author;
