import {
  getAll,
  createBook,
  deleteBook,
  getBookById,
  updateBook,
} from "../services/book.service.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await getAll();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách sách." });
  }
};

export const getBookByID = async (req, res) => {
  try {
    const books = await getBookById(req.params.id);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy sách." });
  }
};

export const createNewBook = async (req, res) => {
  try {
    const book = await createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ message: "Lỗi khi thêm sách." });
  }
};

export const deleteBookService = async (req, res) => {
  try {
    const book = await deleteBook(req.params.id);
    res.status(201).json(book);
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Lỗi khi xóa sách." });
  }
};

export const updateBookService = async (req, res) => {
  try {
    const book = await updateBook(req.params.id, req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật sách." });
  }
};
