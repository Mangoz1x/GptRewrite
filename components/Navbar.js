import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import { SessionActive } from "../helpers/account";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Module({ webData, ytmp4, subscriptionType, avatarCode, transparent, scrollFade, webSession }) {
    const [activeTab, setActiveTab] = useState(webData?.navbar?.buttons?.[0]?.name || "Null");
    const [dynamicTransparent, setDynamicTransparent] = useState(transparent || false);
    const [session, setSession] = useState(webSession || null);
    const [avatar, setAvatar] = useState(avatarCode || "");
    const [subscription, setSubscription] = useState(subscriptionType || null);

    let buttons = subscription
        ? webData.paying.navbar.buttons
        : session
            ? webData.loggedIn.navbar.buttons
            : webData.navbar.buttons;

    if (ytmp4 == true) {
        buttons = [...buttons, { name: "YTMP4", href: "/ytmp4" }]
    }

    const evalSession = async () => {
        const session = await SessionActive();
        setSession(session?.session || false);
        setAvatar(session?.avatar);
        setSubscription(session?.subscription);
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setActiveTab(window.location.pathname);
            if (session == null) evalSession();

            if (scrollFade) window.addEventListener("scroll", () => {
                if (window.scrollY > 50) return setDynamicTransparent(false);
                setDynamicTransparent(true);
            });
        }
    }, [])

    return (
        <Disclosure as="nav" className={`${dynamicTransparent ? "" : webData.component_colors.navbar} transition-all duration-300`}>
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 sm:py-3">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-end sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-8 w-auto lg:hidden mr-2"
                                        src="/images/logo.png"
                                        alt="Your Company"
                                    />
                                    <img
                                        className="hidden h-8 w-auto lg:block"
                                        src="/images/logo.png"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className={`hidden sm:block ml-8 mr-0 ${session ? "sm:ml-auto sm:mr-auto" : "sm:ml-auto"}`}>
                                    <div className="flex space-x-4">
                                        {buttons.map((item) => (
                                            <Link href={item.href} key={item.name}>
                                                <div
                                                    onClick={() => setActiveTab(item.name)}
                                                    className={classNames(
                                                        item.href == activeTab ? `${webData.component_colors.navbar_active} text-white` : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'px-3 py-2 rounded-md text-sm font-medium'
                                                    )}
                                                    aria-current={item.href == activeTab ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {
                                session ? (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src={`data:image/svg+xml;utf8,${avatar}`}
                                                        alt=""
                                                    />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link href="/user/profile">
                                                                <span
                                                                    className={classNames(active ? 'bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-300')}
                                                                >
                                                                    Your Profile
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link href="/api/auth/signout">
                                                                <span
                                                                    className={classNames(active ? 'bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-300')}
                                                                >
                                                                    Sign out
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {buttons.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}