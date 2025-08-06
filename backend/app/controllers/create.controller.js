import { createStaff, createReader } from "../services/create.service.js";
import ApiError from "../api-error.js";

export const createUser = async (req, res, next) => {
  try {
    if (req.body.vaiTro === "quantrivien" || req.body.vaiTro === "nhanvien") {
      const user = await createStaff(req.body);
      return res
        .status(201)
        .json({ message: "Đăng ký thành công", maDocGia: user.maDocGia });
    } else {
      const user = await createReader(req.body);
      return res
        .status(201)
        .json({ message: "Đăng ký thành công", maDocGia: user.maDocGia });
    }
  } catch (error) {
    console.error(error);
    next(new ApiError(500, "Lỗi tạo tài khoản."));
  }
};
