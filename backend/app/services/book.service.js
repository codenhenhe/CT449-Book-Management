import Book from "../models/book.model.js";

// const getAllBooks = async (page, limit, sortBy, sortOrder) => {
//   return await Book.find()
//     .sort({ [sortBy]: sortOrder })
//     .skip((page - 1) * limit)
//     .populate("tacGia")
//     .populate("theLoai")
//     .populate("nhaXuatBan")
//     .limit(parseInt(limit));
// };

export const getBookById = async (id) => {
  return await Book.findById(id);
};

export const getBookByQuery = async (limit, query) => {
  return await Book.find(query)
    .limit(parseInt(limit))
    .populate("tacGia")
    .populate("theLoai");
};

// const countTotalPage = async () => {
//   return await Book.countDocuments();
// };

export const createBook = async (payload) => {
  const book = new Book(payload);
  const saved = await book.save();
  return saved;
};

export const deleteBook = async (id) => {
  return await Book.findByIdAndDelete(id);
};

export const updateBook = async (bookId, updateData) => {
  return await Book.findByIdAndUpdate(bookId, updateData, { new: true });
};

export const getAll = async () => {
  return await Book.find();
};
