import axios from 'axios';
// import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true, errorCreate: '' };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false, errorCreate: '' };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false, errorCreate: action.payload };

        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };

        default:
            return state;
    }
}

export default function AdminNewProductScreen() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    // const [image, setImage] = useState(null);

    const [
        { loadingUpload },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        products: [],
        error: '',
    });


    const onSubmit = async () => {
        try {
            setLoading(true);
            // send product data and image to backend
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('slug', data.slug);
            formData.append('price', data.price);
            formData.append('category', data.category);
            formData.append('brand', data.brand);
            formData.append('countInStock', data.countInStock);
            formData.append('description', data.description);
            // formData.append('image', image);
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(`/api/admin/products`);
            dispatch({ type: 'CREATE_SUCCESS' });
            toast.success('Product created successfully');
            router.push(`/admin/product/${data.product._id}`);
        } catch (error) {
            dispatch({ type: 'CREATE_FAIL' });
            setLoading(false);
            toast.error(getError(error));
        }
    };

    const uploadHandler = async (e, imageField = 'image') => {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const {
                data: { signature, timestamp },
            } = await axios('/api/admin/cloudinary-sign');

            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
            const { data } = await axios.post(url, formData);
            dispatch({ type: 'UPLOAD_SUCCESS' });
            setValue(imageField, data.secure_url);
            toast.success('File uploaded successfully');
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
            toast.error(getError(err));
        }
    };



    return (
        <Layout title={`Edit Product `}>
            <div className="grid md:grid-cols-4 md:gap-5">
                <div>
                    <ul>
                        <li>
                            <Link href="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/admin/orders">Orders</Link>
                        </li>
                        <li>
                            <Link href="/admin/products" className="font-bold">
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users">Users</Link>
                        </li>
                    </ul>
                </div>
                <div className="md:col-span-3">

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="mb-4 text-xl">{`Add Product`}</h1>

                        <div className="mb-4">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="w-full"
                                id="name"
                                autoFocus
                                {...register('name', {
                                    required: 'Please enter name',
                                })}
                            />
                            {errors.name && (
                                <div className="text-red-500">{errors.name.message}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="slug">Slug</label>
                            <input
                                type="text"
                                className="w-full"
                                id="slug"
                                {...register('slug', {
                                    required: 'Please enter slug',
                                })}
                            />
                            {errors.slug && (
                                <div className="text-red-500">{errors.slug.message}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price">Price</label>
                            <input
                                type="text"
                                className="w-full"
                                id="price"
                                {...register('price', {
                                    required: 'Please enter price',
                                })}
                            />
                            {errors.price && (
                                <div className="text-red-500">{errors.price.message}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="image">image</label>
                            <input
                                type="text"
                                className="w-full"
                                id="image"
                                {...register('image', {
                                    required: 'Please enter image',
                                })}
                            />
                            {errors.image && (
                                <div className="text-red-500">{errors.image.message}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="imageFile">Upload image</label>
                            <input
                                type="file"
                                className="w-full"
                                id="imageFile"
                                onChange={uploadHandler}
                            />

                            {loadingUpload && <div>Uploading....</div>}
                        </div>



                        <div className="mb-4">
                            <label htmlFor="category">category</label>
                            <input
                                type="text"
                                className="w-full"
                                id="category"
                                {...register('category', {
                                    required: 'Please enter category',
                                })}
                            />
                            {errors.category && (
                                <div className="text-red-500">{errors.category.message}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="brand">brand</label>
                            <input
                                type="text"
                                className="w-full"
                                id="brand"
                                {...register('brand', {
                                    required: 'Please enter brand',
                                })}
                            />
                            {errors.brand && (
                                <div className="text-red-500">{errors.brand.message}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="countInStock">countInStock</label>
                            <input
                                type="text"
                                className="w-full"
                                id="countInStock"
                                {...register('countInStock', {
                                    required: 'Please enter countInStock',
                                })}
                            />
                            {errors.countInStock && (
                                <div className="text-red-500">
                                    {errors.countInStock.message}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="countInStock">description</label>
                            <input
                                type="text"
                                className="w-full"
                                id="description"
                                {...register('description', {
                                    required: 'Please enter description',
                                })}
                            />
                            {errors.description && (
                                <div className="text-red-500">
                                    {errors.description.message}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <button className="primary-button">
                                {'Submit New Product'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Layout>
    );
}

AdminNewProductScreen.auth = { adminOnly: true };
