const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  if (!query) {
    ctx.status = 404;
    ctx.body = "Bad Request";
    return;
  }

  const result = await Product
    .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
    .limit(20)
    .sort({ score: { $meta: "textScore" } })

  ctx.body = { products: result.map(elem => mapProduct(elem)) }
};
