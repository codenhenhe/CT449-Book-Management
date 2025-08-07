import nodemailer from "nodemailer";

export const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // hoặc smtp khác
    auth: {
      user: process.env.EMAIL_USER, // Gmail của bạn
      pass: process.env.EMAIL_PASS_APP, // Mật khẩu ứng dụng (không phải mật khẩu Gmail thường)
    },
  });

  const mailOptions = {
    from: `"Quản lý sách" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Đặt lại mật khẩu tài khoản",
    html: `
      <p>Chào bạn,</p>
      <p>Bạn đã yêu cầu đổi mật khẩu cho tài khoản.</p>
      <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu (hết hạn sau 15 phút):</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Hệ thống quản lý sách</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
