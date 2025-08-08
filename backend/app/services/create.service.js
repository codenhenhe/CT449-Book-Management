import Reader from "../models/reader.model.js";
import bcrypt from "bcrypt";
import Staff from "../models/staff.model.js";

export const createReader = async (data) => {
  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.matKhau, 10);

    // Tạo document đọc giả mới
    const newReader = new Reader({
      ten: data.ten,
      hoLot: data.hoLot,
      ngaySinh: data.ngaySinh,
      phai: data.phai,
      diaChi: data.diaChi,
      soDienThoai: data.soDienThoai,
      matKhau: hashedPassword,
      email: data.email,
      vaiTro: "docgia", // Giá trị cố định từ schema
      // maDocGia sẽ tự động được tạo bởi default trong schema
    });

    // Lưu document vào database
    const savedReader = await newReader.save();
    return savedReader;
  } catch (error) {
    // Xử lý lỗi trùng lặp (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // Lấy trường gây lỗi
      const value = error.keyValue[field]; // Giá trị trùng lặp
      let message = "";

      switch (field) {
        case "email":
          message = `Email "${value}" đã tồn tại.`;
          break;
        case "soDienThoai":
          message = `Số điện thoại "${value}" đã tồn tại.`;
          break;
        case "maDocGia":
          message = `Mã đọc giả "${value}" đã tồn tại.`;
          break;
        default:
          message = "Dữ liệu trùng lặp, vui lòng kiểm tra lại.";
      }

      throw new Error(message);
    } else {
      throw new Error(`Lỗi khi tạo đọc giả: ${error.message}`);
    }
  }
};

export const createStaff = async (data) => {
  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.matKhau, 10);

    // Tạo document nhân viên mới
    const newStaff = new Staff({
      ten: data.ten,
      hoLot: data.hoLot,
      ngaySinh: data.ngaySinh,
      phai: data.phai,
      diaChi: data.diaChi,
      soDienThoai: data.soDienThoai,
      matKhau: hashedPassword,
      email: data.email,
      vaiTro: data.vaiTro,
      // maNhanVien sẽ tự động được tạo bởi default trong schema
    });

    // Lưu document vào database
    const savedStaff = await newStaff.save();
    return savedStaff;
  } catch (error) {
    // Xử lý lỗi trùng lặp (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // Lấy trường gây lỗi
      const value = error.keyValue[field]; // Giá trị trùng lặp
      let message = "";

      switch (field) {
        case "email":
          message = `Email "${value}" đã tồn tại.`;
          break;
        case "soDienThoai":
          message = `Số điện thoại "${value}" đã tồn tại.`;
          break;
        case "maNhanVien":
          message = `Mã nhân viên "${value}" đã tồn tại.`;
          break;
        default:
          message = "Dữ liệu trùng lặp, vui lòng kiểm tra lại.";
      }

      throw new Error(message);
    } else {
      throw new Error(`Lỗi khi tạo nhân viên: ${error.message}`);
    }
  }
};
