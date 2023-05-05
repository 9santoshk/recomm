import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user || (user && (user.userType !== 'Merchant'))) {
    return res.status(401).send('signin required');
  }

  await db.connect();

  // const ordersCount = await Order.countDocuments();
  // const productsCount = await Product.countDocuments();
  const productsCount = await Product.countDocuments({ merchantEmail: user.email });
  const products = await Product.find({ merchantEmail: user.email });
  const productIds = products.map((product) => product._id);
  const ordersCount = await Order.countDocuments({
    'orderItems.product._id': { $in: productIds },
  });



  const ordersPriceGroup = await Order.aggregate([
    {
      $match: {
        'orderItems.productId': { $in: productIds },
      },
    },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);


  const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $match: {
        'orderItems.product._id': { $in: productIds },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  await db.disconnect();
  res.send({ ordersCount, productsCount, ordersPrice, salesData });
};

export default handler;
