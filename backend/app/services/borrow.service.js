import Borrow from "../models/borrow.model.js";

module.exports.getBorrow = async (
  query,
  sortBy = "ngayMuon",
  sortOrder = -1
) => {
  return Borrow.find(query)
    .sort({ [sortBy]: sortOrder })
    .populate("sach")
    .populate("docGia");
};

module.exports.createBorrow = async (data) => {
  return Borrow.save(data);
};

module.exports.deleteBorrow = async (id) => {
  return Borrow.findByIdAndDelete(id);
};

module.exports.getBorrowById = async (id) => {
  return Borrow.findById(id);
};
