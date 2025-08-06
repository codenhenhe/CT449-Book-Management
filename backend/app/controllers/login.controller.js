import { getStaffbyCode } from "../services/staff.service.js";
import { getReaderbyCode } from "../services/reader.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const maDangNhap = req.body.maDangNhap;
    const matKhau = req.body.matKhau;
    let user = null;
    let role = "";
    let tokenPayload = {};

    // 1. Tìm trong bảng nhân viên (có thể là nhanvien hoặc quantrivien)
    user = await getStaffbyCode(maDangNhap);
    if (user) {
      role = user.vaiTro;
      tokenPayload = {
        id: user._id,
        maNhanVien: user.maNhanVien,
        vaiTro: role,
      };
    } else {
      // 2. Nếu không có → tìm trong bảng đọc giả
      user = await getReaderbyCode(maDangNhap);
      if (user) {
        role = "docgia";
        tokenPayload = {
          id: user._id,
          maDocGia: user.maDocGia,
          vaiTro: role,
        };
      }
    }

    // 3. Không tìm thấy trong cả hai bảng
    if (!user) {
      return res.status(400).json({
        message: "Mã đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    // 4. So sánh mật khẩu
    const isPasswordMatch = await bcrypt.compare(matKhau, user.matKhau);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Mật khẩu không đúng! Vui lòng nhập lại.",
      });
    }

    // 5. Tạo JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 6. Trả về thông tin người dùng
    res.status(200).json({
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: user._id,
        hoLot: user.hoLot,
        ten: user.ten,
        phai: user.phai,
        maSo: role === "docgia" ? user.maDocGia : user.maNhanVien,
        soDienThoai: user.soDienThoai,
        diaChi: user.diaChi,
        ngaySinh: user.ngaySinh,
        vaiTro: role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập." });
  }
};
