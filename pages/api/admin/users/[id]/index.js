import User from '../../../../../models/User';
import db from '../../../../../utils/db';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  console.log(req.method)
  const user = await getToken({ req });
  if (!user || !user.isAdmin) {
    return res.status(401).send('admin signin required');
  }


  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  await db.connect();
  const product = await User.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.slug = req.body.email;
    user.isAdmin = req.body.isAdmin;
    user.isActiveUser = req.body.isActiveUser;
    user.userType = req.body.userType;
    await user.save();
    await db.disconnect();
    res.send({ message: 'User updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found' });
  }
};


const deleteHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Can not delete admin' });
    }
    await user.remove();
    await db.disconnect();
    res.send({ message: 'User Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User Not Found' });
  }
};

export default handler;
