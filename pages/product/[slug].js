import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
// import IoChevronBackOutline from 'react-icons/io'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Rating from 'react-star-rating-component';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const [currentImage, setCurrentImage] = useState(product.image)
  // eslint-disable-next-line no-unused-vars
  const [reviews, setReviews] = useState([]);
  const productId = product._id

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(response.data);
    };
    fetchReviews();
  }, [productId]);

  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }
  const handleImageClick = (image) => {
    setCurrentImage(image);
  };
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/" legacyBehavior={true}>
          <a className="flex items-center">
            <ArrowBackIcon />
            <span className="ml-1">Back to products</span>
          </a>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 md:gap-3" style={{ gridTemplateColumns: "2fr 2fr 1fr" }}>
        <div className="md:col-sp an-1">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          ></Image>

          <div className="flex mt-2">
            {product.imagelist.map((image) => (
              <div
                key={image}
                className={`cursor-pointer w-20 h-20 border-2 border-gray-300 ${image === currentImage ? 'border-blue-500' : ''
                  }`}
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={product.name}
                  width={80}
                  height={80}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
              <Rating
                value={product.rating}
                // onStarClick={(nextValue, prevValue, name) => handleStarClick(nextValue, prevValue, name)}
                starCount={5}
                starColor={'#ffb400'}
                emptyStarColor={'#ccc'}
              />
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>

          {/* <div>
            {reviews.map((review) => (
              <div key={review._id}>
                <p>{review.name}</p>
                <p>{review.rating}</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
