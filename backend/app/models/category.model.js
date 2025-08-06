import mongoose from "mongoose";
const { Schema, model } = mongoose;
const categorySchema = new Schema({
  tenTheLoai: {
    type: String,
    unique: true,
    required: [true, "Vui lòng nhập thể loại sách"],
  },
  moTa: String,
});
const Category = model("Category", categorySchema, "theloai");
export default Category;
