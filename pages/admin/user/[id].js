import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';

function reducer(state, action) {
    // console.log(action.type)
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true, errorUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, errorUpdate: '' };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };
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
export default function AdminUserEditScreen() {
    const { query } = useRouter();
    const userId = query.id;
    const [{ loading, error, loadingUpdate }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });
    // console.log(userId)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/users/${userId}`);
                // console.log('test', data)
                dispatch({ type: 'FETCH_SUCCESS' });
                setValue('name', data.name);
                setValue('email', data.email);
                setValue('isAdmin', data.isAdmin);
                setValue('userType', data.userType);
                setValue('isActiveUser', data.isActiveUser);
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        fetchData();
    }, [userId, setValue]);

    const router = useRouter();


    const submitHandler = async ({
        name,
        email,
        isAdmin,
        userType,
        isActiveUser,
    }) => {
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`/api/admin/users/${userId}`, {
                name,
                email,
                isAdmin,
                userType,
                isActiveUser,
            });
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('User updated successfully');
            router.push('/admin/users');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <Layout title={`Edit User ${userId}`}>
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
                            <Link href="/admin/merchants">Users</Link>

                        </li>
                        <li>
                            <Link href="/admin/users">Users</Link>

                        </li>
                    </ul>
                </div>
                <div className="md:col-span-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <form
                            className="mx-auto max-w-screen-md"
                            onSubmit={handleSubmit(submitHandler)}
                        >
                            <h1 className="mb-4 text-xl">{`Edit User ${userId}`}</h1>
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
                                <label htmlFor="email">email</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    id="email"
                                    {...register('email', {
                                        required: 'Please enter email',
                                    })}
                                />
                                {errors.email && (
                                    <div className="text-red-500">{errors.email.message}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="isAdmin">IsAdmin</label>
                                <select
                                    id="isAdmin"
                                    className="w-full"
                                    {...register('isAdmin', {
                                        required: 'Please enter isAdmin',
                                    })}
                                >
                                    <option value="">Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>

                                {errors.isAdmin && (
                                    <div className="text-red-500">{errors.isAdmin.message}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userType">userType</label>
                                <select
                                    id="userType"
                                    className="w-full"
                                    {...register('userType', {
                                        required: 'Please select userType',
                                    })}
                                >
                                    <option value="">Select</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Merchant">Merchant</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                {errors.userType && (
                                    <div className="text-red-500">{errors.userType.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="isActiveUser">isActiveUser</label>
                                <select
                                    id="isActiveUser"
                                    className="w-full"
                                    {...register('isActiveUser', {
                                        required: 'Please select isActiveUser',
                                    })}
                                >
                                    <option value="">Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                {errors.isActiveUser && (
                                    <div className="text-red-500">{errors.isActiveUser.message}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <button disabled={loadingUpdate} className="primary-button">
                                    {loadingUpdate ? 'Loading' : 'Update'}
                                </button>
                            </div>
                            <div className="mb-4">
                                <Link href={`/admin/users`}>Back</Link>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}

AdminUserEditScreen.auth = { adminOnly: true };
