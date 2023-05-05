import { getToken } from 'next-auth/jwt';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user || (user && !user.isMerchant)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    await db.connect();
    // const orders = await Order.find({}).populate('user', 'name');
    const orders = await Order.find({ 'products.merchantEmail': user.email }).populate('user', 'name');
    await db.disconnect();
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
