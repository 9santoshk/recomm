import { getToken } from 'next-auth/jwt';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user || !user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res, user) => {
  await db.connect();
  const { name, slug, image, price, category, brand, countInStock, description } = req.body;
  const newProduct = new Product({
    name: name || 'sample name',
    slug: slug || 'sample-name-' + Math.random(),
    image: image || '/images/shirt1.jpg',
    price: price || 0,
    category: category || 'sample category',
    brand: brand || 'sample brand',
    countInStock: countInStock || 0,
    description: description || 'sample description',
    rating: 0,
    numReviews: 0,
    merchantEmail: user.email,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product created successfully', product });
};
const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;
