const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const ObjectId = require('mongoose').Types.ObjectId;

//this function works with results of queries for productsBySubcategory & productList
function queryResult(res) {
  return res ? res.map(elem => mapProduct(elem)) : [];
}

//isValidId & queryByIdResult for productById
//id validation
const isValidId = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;
//queryById
function queryByIdResult(res, ctx) {
  res ? ctx.body = { product: mapProduct(res) } : ctx.status = 404;
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  ctx.body = { products: queryResult(await Product.find({ subcategory })) };
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = { products: queryResult(await Product.find()) };
};

module.exports.productById = async function productById(ctx, next) {
  const idx = ctx.request.url.split('/')[3];
  isValidId(idx) ? queryByIdResult(await Product.findOne({ _id: idx }), ctx) : ctx.status = 400;
};

