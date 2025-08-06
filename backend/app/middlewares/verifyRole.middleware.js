export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.vaiTro)) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    next();
  };
};
