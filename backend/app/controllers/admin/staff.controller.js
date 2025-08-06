import {
  getAllStaffs,
  getStaffbyId,
  getStaffbyCode,
  updateStaff,
  deleteStaff,
} from "../../services/staff.service.js";

import ApiError from "../../api-error.js";

export const getAllStaff = async (req, res, next) => {
  try {
    const staffs = await getAllStaffs();
    if (!staffs) {
      return next(new ApiError(404, "Không có đọc giả."));
    }
    res.status(200).json(staffs);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn nhân viên"));
  }
};

export const getStaffByID = async (req, res, next) => {
  try {
    const staff = await getStaffbyId(req.params.id);
    if (!staff) {
      return next(new ApiError(404, "Không tìm thấy nhân viên."));
    }
    res.status(200).json(staff);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn nhân viên."));
  }
};

export const getStaffByCode = async (req, res, next) => {
  try {
    const staff = await getStaffbyCode(req.params.id);
    if (!staff) {
      return next(new ApiError(404, "Không tìm thấy nhân viên."));
    }
    res.status(200).json(staff);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn nhân viên."));
  }
};

export const updateStaffController = async (req, res, next) => {
  try {
    const staff = await updateStaff(req.params.id, req.body);
    console.log(staff);

    if (!staff) {
      return next(new ApiError(404, "Không tìm thấy nhân viên."));
    }
    return res.send({ message: "Cập nhật thông tin thành công." });
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn nhân viên."));
  }
};

export const deleteStaffController = async (req, res, next) => {
  try {
    const staff = await deleteStaff(req.params.id);
    // console.log(staff);

    if (!staff) {
      return next(new ApiError(404, "Không tìm thấy nhân viên."));
    }
    return res.send({ message: "Xóa tài khoản thành công." });
    // res.status(200).json(staff);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn nhân viên."));
  }
};
