/* eslint-disable react/jsx-key */
/* eslint-disable no-console */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable import/no-extraneous-dependencies */
import { Disclosure } from '@headlessui/react';
import { Avatar, Dropdown } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import ThemeChanger from './DarkSwitch';

export default function Navbar() {
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  const { data, status } = useSession();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const imgUrl = data?.user?.image || '/img/avatar.svg';
  const Router = useRouter();

  const goToCheckout = async () => {
    setIsCheckoutLoading(true);
    const res = await fetch('api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      setIsCheckoutLoading(false);
      console.error('Error creating checkout session');
    }
  };

  return (
    <>
      <main>
        {data && (
          <div>
            <button
              onClick={() => {
                if (isCheckoutLoading) return;
                goToCheckout();
              }}
            >
              {isCheckoutLoading ? 'Loading...' : 'Add Payment Method'}
            </button>
          </div>
        )}
      </main>
      <div className="w-full">
        <nav className="container relative mx-auto flex flex-wrap items-center justify-between p-8 lg:justify-between xl:px-0">
          {/* Logo  */}
          <Disclosure>
            {({ open }) => (
              <>
                <div className="flex w-full flex-wrap items-center justify-between lg:w-auto">
                  <Link href="/" legacyBehavior>
                    <a className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                      <span>
                        <img
                          src="/img/logo.svg"
                          alt="N"
                          width="32"
                          height="32"
                          className="w-8"
                        />
                      </span>
                      <span>Nextly</span>
                    </a>
                  </Link>

                  <Disclosure.Button
                    aria-label="Toggle Menu"
                    className="ml-auto rounded-md px-2 py-1 text-gray-500 hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700 lg:hidden"
                  >
                    <svg
                      className="h-6 w-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      {open && (
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                        />
                      )}
                      {!open && (
                        <path
                          fillRule="evenodd"
                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                        />
                      )}
                    </svg>
                  </Disclosure.Button>

                  <Disclosure.Panel className="my-5 flex w-full flex-wrap lg:hidden">
                    <>
                      {navigation?.main?.map((item, index) => (
                        <Link href={item?.href} key={index} legacyBehavior>
                          <a className="block w-full px-4 py-2 text-sm font-medium text-gray-500 hover:bg-indigo-100 hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-300">
                            {item?.name}
                          </a>
                        </Link>
                      ))}
                      {status === 'loading' && <p>Loading...</p>}
                      {status === 'unauthenticated' && (
                        <button
                          className='className="mt-3 lg:ml-5" w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white'
                          onClick={() => signIn()}
                        >
                          Sign In
                        </button>
                      )}
                      {status === 'authenticated' && (
                        <button
                          className='className="mt-3 lg:ml-5" w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white'
                          onClick={() => signOut().then(() => Router.push('/'))}
                        >
                          Sign Out
                        </button>
                      )}
                    </>
                  </Disclosure.Panel>
                </div>
              </>
            )}
          </Disclosure>

          {/* menu  */}
          <div className="hidden text-center lg:flex lg:items-center">
            <ul className="flex-1 list-none items-center justify-end pt-6 lg:flex lg:pt-0">
              {navigation?.main?.map((menu, index) => (
                <li className="nav__item mr-3" key={index}>
                  <Link href={menu?.href} legacyBehavior>
                    <a className="inline-block rounded-md px-4 py-2 text-lg font-normal text-gray-800 no-underline hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-200 dark:focus:bg-gray-800">
                      {menu?.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__item mr-3 hidden space-x-4 lg:flex">
            {status === 'loading' && <p>Loading...</p>}
            {status === 'unauthenticated' && (
              <button
                className='className="mt-3 lg:ml-5" w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white'
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
            {status === 'authenticated' && (
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                  <Avatar alt="User settings" img={imgUrl} rounded={true} />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{data?.user?.name}</span>
                  <span className="block truncate text-sm font-medium">
                    {data?.user?.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <Link href={'/dashboard'}>Dashboard</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link href={'/projects'}>Projects</Link>
                </Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>
                  {status === 'authenticated' ? (
                    <button
                      className="w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white"
                      onClick={() => signOut().then(() => Router.push('/'))}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      className="w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white"
                      onClick={() => signIn()}
                    >
                      Sign In
                    </button>
                  )}
                </Dropdown.Item>
                <Dropdown.Divider />
              </Dropdown>
            )}

            <ThemeChanger />
          </div>
          {/* add user persona and when clicked open user info  */}
        </nav>
      </div>
    </>
  );
}
