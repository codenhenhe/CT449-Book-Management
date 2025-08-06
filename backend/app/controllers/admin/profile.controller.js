import { getStaffbyCode, updateStaff } from "../../services/staff.service.js";
import ApiError from "../../api-error.js";

export const getMe = async (req, res, next) => {
  try {
    const staff = await getStaffbyCode(req.params.id);
    if (!staff) {
      return next(new ApiError(404, "Không tìm thấy người dùng."));
    }
    res.status(200).json(staff);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn."));
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const staff = await updateStaff(req.params.id, req.body);
    console.log(staff);

    if (!staff) {
      return next(new ApiError(404, "Không tìm thấy người dùng."));
    }
    return res.send({ message: "Cập nhật thông tin thành công." });
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn."));
  }
};
