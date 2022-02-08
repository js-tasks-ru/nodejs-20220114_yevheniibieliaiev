const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const result = await Category.find();
  ctx.body = { categories: result.map(elem => mapCategory(elem)) };
};
