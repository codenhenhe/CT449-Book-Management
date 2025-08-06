import Borrow from "../models/borrow.model.js";

const checkExpiredBorrows = async (req, res, next) => {
  try {
    const now = new Date();
    await Borrow.updateMany(
      {
        trangThai: "cholay",
        ngayLaySachDuKien: { $lt: now },
      },
      { trangThai: "dahuy" }
    );
    next();
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái hủy tự động do đọc giả quá hạn lấy sách:",
      error
    );
    next();
  }
};

export default checkExpiredBorrows;
