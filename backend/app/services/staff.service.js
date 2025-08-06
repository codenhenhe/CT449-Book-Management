import Staff from "../models/staff.model.js";

export const getAllStaffs = async () => {
  return await Staff.find();
};

export const getStaffbyCode = async (maNhanVien) => {
  if (typeof maNhanVien !== "string") return null;

  return await Staff.findOne({
    maNhanVien: { $regex: `^${maNhanVien}$`, $options: "i" },
  });
};

export const getStaffbyRole = async (role) => {
  return Staff.find({ vaiTro: role });
};

export const getStaffbyId = async (staffId) => {
  return Staff.findById(staffId);
};

export const deleteStaff = async (staffId) => {
  return await Staff.findOneAndDelete(staffId);
};

export const updateStaff = async (staffId, updateData) => {
  return await Staff.findByIdAndUpdate(staffId, updateData, { new: true });
};
