import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { Drawer } from 'antd';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
// import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineAntDesign, AiOutlineShoppingCart } from 'react-icons/ai'
import axios from 'axios';
import { getError } from '../utils/error';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // Add state to manage drawer visibility
  const router = useRouter();


  const showDrawer = () => {
    setIsDrawerVisible(true);
  }; // Function to show the drawer

  const onClose = () => {
    setIsDrawerVisible(false);
  }; // Function to hide the drawer

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  // const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
      // console.log(data)
    } catch (err) {
      toast.error(getError(err));
    }
  };


  const ToggleButton = () => {
    // console.log(categories)
    return (
      <div>
        <AiOutlineMenu onClick={showDrawer} style={{ fontSize: "24px", color: "blue" }} />
        <Drawer
          title="Categories"
          placement="left"
          closable={false}
          onClose={onClose}
          open={isDrawerVisible}
          bodyStyle={{ backgroundColor: "#f5f5f5" }}
        >
          <Menu>
            {categories.map((category) => (
              <Menu.Item key={category}>
                <Link href={`/search?query=${category}`}>
                  <span style={{ display: "block" }}>{category}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Drawer>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Colour My Space' : 'Colour My Space'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">

            <div>
              {ToggleButton}
              {/* <AiOutlineMenu onClick={ToggleButton}> </AiOutlineMenu> */}
            </div>
            <ToggleButton />

            <AiOutlineAntDesign color="red" />

            <Link href="/" className="text-lg font-bold">
              Colour My Space
            </Link>
            <form
              onSubmit={submitHandler}
              className="mx-auto  hidden  justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <AiOutlineSearch className="h-5 w-5"></AiOutlineSearch>
              </button>
            </form>
            <div className="flex items-center z-10">
              <Link href="/about" className="p-2">
                About Us
              </Link>
            </div>
            <div className="horizontal-item">|</div>


            <div className="flex items-center z-10">
              <Link href="/cart" className="p-2">
                {/* Cart */}
                <AiOutlineShoppingCart />

                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <div className="horizontal-item">|</div>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                    <AiOutlineMenu />

                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2">
                  Login
                </Link>
              )}


            </div>
            {/* <Drawer
              title="Categories"
              placement="left"
              closable={false}
              onClose={() => setIsOpen(!isOpen)}
              visible={toggle}
            >
              {fetchCategories && fetchCategories.map((category) => (
                <Menu.Item key={category.id}>{category.name}</Menu.Item>
              ))}
            </Drawer> */}
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Colour My Space</p>
        </footer>
      </div>
    </>
  );
}