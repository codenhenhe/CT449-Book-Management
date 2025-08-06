import Borrow from "../models/borrow.model.js";
import Book from "../models/book.model.js";

export const createBorrow = async (req, res) => {
  try {
    const { maDocGia, maSach, ngayDatSach, ngayLaySachDuKien, ghiChu } =
      req.body;

    if (!maDocGia || !maSach || !ngayDatSach || !ngayLaySachDuKien) {
      return res.status(400).json({ message: "Thiếu thông tin yêu cầu." });
    }

    const book = await Book.findById(maSach);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }

    // Kiểm tra số lượng còn lại
    if (book.soQuyenConLai <= 0) {
      return res.status(400).json({ message: "Sách đã được mượn hết." });
    }

    // Trừ số lượng sách còn lại
    book.soQuyenConLai -= 1;
    await book.save();

    //  Tạo phiếu mượn
    const borrow = new Borrow({
      maDocGia,
      maSach,
      ngayDatSach,
      ngayLaySachDuKien,
      ghiChu,
      trangThai: "cholay",
    });
    await borrow.save();

    res.status(201).json(borrow);
  } catch (err) {
    console.error("Lỗi khi tạo phiếu mượn:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const getByUser = async (req, res) => {
  const borrows = await Borrow.find({ maDocGia: req.params.id })
    .populate("maSach", "tenSach")
    .sort({ ngayDatSach: -1 });
  res.json(borrows);
};

export const cancel = async (req, res) => {
  const borrow = await Borrow.findById(req.params.id);
  if (!borrow || borrow.trangThai !== "cholay") {
    return res.status(400).json({ message: "Không thể huỷ lượt mượn này" });
  }

  borrow.trangThai = "dahuy";
  await borrow.save();

  // Hoàn trả số lượng
  await Book.findByIdAndUpdate(borrow.maSach, {
    $inc: { soQuyenConLai: 1 },
  });

  res.json({ message: "Đã huỷ lượt mượn" });
};

export const getAll = async (req, res) => {
  try {
    const borrows = await Borrow.find().populate("maSach").populate("maDocGia");
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách mượn sách." });
  }
};

export const updateStatus = async (req, res) => {
  try {
    // console.log("Body nhận được:");
    // const trangThai = req.body.status;
    // // console.log("Trạng thái nhận:", req.body.status);

    // const allowedStatuses = ["cholay", "dalay", "datra", "hethan", "dahuy"];
    // if (!allowedStatuses.includes(trangThai)) {
    //   return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    // }

    const updated = await Borrow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy đơn mượn." });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Cập nhật trạng thái thất bại." });
  }
};
