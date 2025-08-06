import Author from "../models/author.model.js";

module.exports.getAuthorByName = async (name) => {
  if (typeof name !== "string") return null;

  return await Author.findOne({
    tenTacGia: { $regex: `^${name}$`, $options: "i" },
  });
};

module.exports.getAuthorByCode = async (maTacGia) => {
  if (typeof maTacGia !== "string") return null;

  return await Author.findOne({
    maTacGia: { $regex: `^${maTacGia}$`, $options: "i" },
  });
};

module.exports.getAuthorById = async (id) => {
  return await Author.findById(id);
};

module.exports.getAuthorsbyName = async (name) => {
  return await Author.find({
    tenTacGia: { $regex: `^${name}$`, $options: "i" },
  }).limit(10);
};

module.exports.getAll = async () => {
  return await Author.find();
};
