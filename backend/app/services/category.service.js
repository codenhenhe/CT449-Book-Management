import Category from "../models/category.model.js";

module.exports.getCatogories = async () => {
  return await Category.find();
};

module.exports.getCategoriesByName = async (name) => {
  return await Category.find({
    tenTheLoai: { $regex: `^${name}$`, $options: "i" },
  }).limit(10);
};
