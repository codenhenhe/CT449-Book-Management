import {
  getAll,
  getReaderbyID,
  getReaderbyCode,
  updateReader,
} from "../../services/reader.service.js";
import ApiError from "../../api-error.js";

export const getMe = async (req, res, next) => {
  try {
    const reader = await getReaderbyID(req.params.id);
    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy đọc giả."));
    }
    res.status(200).json(reader);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn đọc giả"));
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const reader = await updateReader(req.params.id, req.body);
    console.log(reader);

    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy đọc giả."));
    }
    return res.send({ message: "Cập nhật thông tin thành công." });
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn đọc giả"));
  }
};
