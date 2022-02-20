const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
  const { product: itemID, phone, address } = ctx.request.body;
  const item = await Product.findById(itemID);
  const { id, email } = ctx.user;

  try {
    const order = await Order.create({ user: id, product: itemID, phone, address });

    await sendMail({
      template: 'order-confirmation',
      locals: mapOrderConfirmation(order, item),
      to: email,
      subject: 'Order confirmation'
    })

    ctx.status = 200;
    ctx.body = { order: order.id };
  } catch (err) {
    throw err
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const { id } = ctx.user;
  const cart = await Order.find({ user: id }).populate('product');
  const orders = cart.map(mapOrder);
  
  ctx.status = 200;
  ctx.body = { orders }
};
