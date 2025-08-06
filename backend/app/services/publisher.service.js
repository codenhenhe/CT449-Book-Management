import Publisher from "../models/publisher.model";

module.exports.getPushlishers = async () => {
  return await Publisher.find();
};

// module.exports.getCategoriesByName = async (name) => {
//   return await CategoryModel.find({
//     ten: { $regex: name, $options: "i" },
//   }).limit(10);
// };
