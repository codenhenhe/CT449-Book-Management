import {
  getAll,
  getReaderbyID,
  getReaderbyCode,
  updateReader,
  deleteReader,
} from "../../services/reader.service.js";
import ApiError from "../../api-error.js";

export const getAllReader = async (req, res, next) => {
  try {
    const readers = await getAll();
    if (!readers) {
      return next(new ApiError(404, "Không có đọc giả."));
    }
    res.status(200).json(readers);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn đọc giả"));
  }
};

export const getReaderByID = async (req, res, next) => {
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

export const getReaderByCode = async (req, res, next) => {
  try {
    const reader = await getReaderbyCode(req.params.id);
    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy đọc giả."));
    }
    res.status(200).json(reader);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn đọc giả"));
  }
};

export const updateReaderController = async (req, res, next) => {
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

export const deleteReaderController = async (req, res, next) => {
  try {
    const reader = await deleteReader(req.params.id);
    // console.log(reader);

    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy đọc giả."));
    }
    return res.send({ message: "Xóa tài khoản thành công." });
    // res.status(200).json(reader);
  } catch (error) {
    next(new ApiError(500, "Lỗi truy vấn đọc giả"));
  }
};
