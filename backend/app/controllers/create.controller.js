import { createStaff, createReader } from "../services/create.service.js";
import ApiError from "../api-error.js";

export const createUser = async (req, res, next) => {
  try {
    if (req.body.vaiTro === "quantrivien" || req.body.vaiTro === "nhanvien") {
      const user = await createStaff(req.body);
      return res
        .status(201)
        .json({ message: "Đăng ký thành công", maDocGia: user.maNhanVien });
    } else {
      const user = await createReader(req.body);
      return res
        .status(201)
        .json({ message: "Đăng ký thành công", maDocGia: user.maDocGia });
    }
  } catch (error) {
    // Xử lý lỗi trùng lặp
    if (error.message.includes("đã tồn tại")) {
      return res.status(400).json({ error: error.message });
    }
    // Xử lý các lỗi khác
    return next(new ApiError(500, `Lỗi tạo tài khoản: ${error.message}`));
  }
};
