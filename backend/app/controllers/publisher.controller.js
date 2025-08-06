import Publisher from "../models/publisher.model.js";

// Lấy tất cả nhà xuất bản
export const getAll = async (req, res) => {
  const publisher = await Publisher.find();
  res.json(publisher);
};

// Thêm nhà xuất bản
export const create = async (req, res) => {
  try {
    const newPublisher = new Publisher(req.body);
    const saved = await newPublisher.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật nhà xuất bản
export const update = async (req, res) => {
  try {
    const updated = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy nhà xuất bản" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa nhà xuất bản
export const remove = async (req, res) => {
  const deleted = await Publisher.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ error: "Không tìm thấy nhà xuất bản" });
  res.json({ message: "Đã xóa thành công" });
};

export const getById = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    res.status(200).json(publisher);
  } catch (err) {
    res.status(500).json({ message: "Không thể tìm thấy nhà xuất bản." });
  }
};
