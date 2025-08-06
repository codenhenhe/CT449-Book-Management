import Reader from "../models/reader.model.js";
import bcrypt from "bcrypt";
import Staff from "../models/staff.model.js";

export const createReader = async (data) => {
  const hashedPassword = await bcrypt.hash(data.matKhau, 10);

  const newReader = new Reader({
    ten: data.ten,
    hoLot: data.hoLot,
    ngaySinh: data.ngaySinh,
    phai: data.phai,
    diaChi: data.diaChi,
    soDienThoai: data.soDienThoai,
    matKhau: hashedPassword,
    email: data.email,
    // anhDaiDien: {
    //   type: String,
    //   required: true,
    // },
    vaiTro: "docgia",
  });

  const savedReader = await newReader.save();
  return savedReader;
};

export const createStaff = async (data) => {
  const hashedPassword = await bcrypt.hash(data.matKhau, 10);

  const newStaff = new Staff({
    ten: data.ten,
    hoLot: data.hoLot,
    ngaySinh: data.ngaySinh,
    phai: data.phai,
    diaChi: data.diaChi,
    soDienThoai: data.soDienThoai,
    matKhau: hashedPassword,
    email: data.email,
    //   anhDaiDien: {
    //     type: String,
    //     required: true,
    //   },
    vaiTro: data.vaiTro,
  });

  const savedStaff = await newStaff.save();
  return savedStaff;
};
