import Author from "../models/author.model.js";

// Lấy tất cả tác giả
export const getAll = async (req, res) => {
  const authors = await Author.find().sort({ tenTacGia: 1 });
  res.json(authors);
};

// Thêm tác giả
export const create = async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const saved = await newAuthor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật tác giả
export const update = async (req, res) => {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy tác giả" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa tác giả
export const remove = async (req, res) => {
  const deleted = await Author.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ error: "Không tìm thấy tác giả" });
  res.json({ message: "Đã xóa thành công" });
};

export const getById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ message: "Không thể tìm thấy tác giả." });
  }
};
