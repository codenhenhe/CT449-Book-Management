import Reader from "../models/reader.model.js";
import Staff from "../models/staff.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendResetEmail } from "../utils/email.js";

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const role = req.user.vaiTro;

    const Model = role === "docgia" ? Reader : Staff;

    // Tìm người dùng
    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.matKhau);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
    }

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);

    await Model.findByIdAndUpdate(userId, { matKhau: hashed });

    res.json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    res
      .status(500)
      .json({ message: "Đổi mật khẩu thất bại. Vui lòng thử lại." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user = await Reader.findOne({ email });
  let userType = "docgia";

  if (!user) {
    user = await Staff.findOne({ email });
    userType = "nhanvien";
  }

  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy người dùng." });
  }

  const token = jwt.sign(
    { userId: user._id, userType },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "15m" }
  );

  const resetLink = `http://localhost:3001/reset-password/${token}`;

  try {
    await sendResetEmail(email, resetLink);
    return res.json({ message: "Đã gửi email khôi phục mật khẩu." });
  } catch (err) {
    console.error("❌ Gửi email lỗi:", err);
    return res
      .status(500)
      .json({ message: "Không thể gửi email. Vui lòng thử lại sau." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const { userId, userType } = decoded;

    const hashed = await bcrypt.hash(newPassword, 10);
    const Model = userType === "docgia" ? Reader : Staff;

    await Model.findByIdAndUpdate(userId, { matKhau: hashed });

    return res.json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};
