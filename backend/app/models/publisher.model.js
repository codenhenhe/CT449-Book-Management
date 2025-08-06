import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const { Schema, model } = mongoose;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 7);

const publisherSchema = new Schema({
  maNXB: {
    type: String,
    default: () => `NXB${nanoid()}`,
    unique: true,
  },
  tenNXB: {
    type: String,
    required: [true, "Vui lòng nhập tên nhà xuất bản"],
  },
  diaChi: {
    type: String,
    required: false,
  },
});
const Publisher = model("Publisher", publisherSchema, "nhaxuatban");
export default Publisher;
