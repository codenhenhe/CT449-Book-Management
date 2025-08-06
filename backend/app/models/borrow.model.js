import mongoose from "mongoose";
import Book from "./book.model.js";
import Reader from "./reader.model.js";

const { Schema, model } = mongoose;

const borrowSchema = new Schema({
  maDocGia: {
    type: Schema.Types.ObjectId,
    ref: Reader,
    required: true,
  },
  maSach: {
    type: Schema.Types.ObjectId,
    ref: Book,
    required: true,
  },
  // Ngay lay sach thuc te
  ngayLaySach: {
    type: Date,
    required: false,
  },
  //   Ngay tra sach thuc te
  ngayTraSach: {
    type: Date,
    required: false,
  },
  // Ngay dat
  ngayDatSach: {
    type: Date,
    required: true,
  },
  ngayLaySachDuKien: {
    type: Date,
    required: true,
  },
  trangThai: {
    type: String,
    enum: ["cholay", "dalay", "datra", "hethan", "dahuy"],
    default: "cholay",
    required: true,
  },
  ghiChu: {
    type: String,
    required: false,
  },
});
const Borrow = model("Borrow", borrowSchema, "theodoimuonsach");
export default Borrow;
