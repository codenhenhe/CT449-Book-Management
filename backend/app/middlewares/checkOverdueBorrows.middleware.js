import Borrow from "../models/borrow.model.js";

const checkOverdueBorrows = async (req, res, next) => {
  try {
    const now = new Date();

    // Tính ngày 7 ngày trước
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await Borrow.updateMany(
      {
        trangThai: "dalay",
        ngayLaySachDuKien: { $lt: sevenDaysAgo },
      },
      { trangThai: "hethan" }
    );

    next();
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái quá hạn sau 7 ngày:", error);
    next();
  }
};

export default checkOverdueBorrows;
