import Reader from "../models/reader.model.js";

export const getReaderbyID = async (readerId) => {
  return await Reader.findById(readerId);
};

export const getReaderbyCode = async (maDocGia) => {
  if (typeof maDocGia !== "string") return null;

  return await Reader.findOne({
    maDocGia: { $regex: `^${maDocGia}$`, $options: "i" },
  });
};

export const getReaderbyPhone = async (phonenumber) => {
  return await Reader.findOne({ soDienThoai: phonenumber });
};

export const updateReader = async (readerId, updateData) => {
  return await Reader.findByIdAndUpdate(readerId, updateData, { new: true });
};

export const deleteReader = async (readerId) => {
  return await Reader.findOneAndDelete(readerId);
};

export const getAll = async () => {
  return await Reader.find();
};
