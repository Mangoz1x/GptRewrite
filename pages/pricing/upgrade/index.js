import Head from 'next/head'
import dynamic from "next/dynamic";
import Link from "next/link";
import webData from "../../../data.json";
import { getCookies } from 'cookies-next';
import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import gateway from "stripe";

const stripe = gateway(process.env.STRIPE_KEY);

const Navbar = dynamic(() => import("../../../components/Navbar"));
const Footer = dynamic(() => import("../../../components/Footer"));

const Module = ({ avatar, subscription, session, basic, pro, expert }) => {
    return (<>
        <div className="w-full h-fit fixed top-0" style={{ zIndex: 9 }}>
          <Navbar subscriptionType={subscription} webData={webData} avatarCode={avatar} session={session || false} transparent={true} scrollFade={true} />
        </div>
        <section style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }} className="min-h-[100vh] text-gray-400 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto mt-20">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-white">Upgrade Plan</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Choose a plan for upgraded perks and features.</p>
                </div>
                <div className="flex flex-wrap -m-4">
                    <div className="p-4 xl:w-1/3 lg:w-1/2 w-full">
                        <div className="bg-velvet h-full p-6 rounded-lg border-2 border-velvet flex flex-col relative overflow-hidden">
                            <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">BASIC</h2>
                            <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                <span>$4.99</span>
                                <span className="text-lg ml-1 font-normal text-gray-400">/mo</span>
                            </h1>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>55 Credits
                            </p>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Fast Response Times
                            </p>
                            <p className="flex items-center text-gray-400 mb-6">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Basic Rewrite
                            </p>
                            
                            {
                                subscription == "basic" ? (
                                    <button disabled className="flex items-center mt-auto text-white bg-gray-900 border-0 py-2 px-4 w-full focus:outline-none rounded">
                                        Current
                                    </button>
                                ) : (
                                    <Link href={basic} className='mt-auto'>
                                        <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">Select
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </Link>
                                )
                            }
                            
                            <p className="text-xs text-gray-400 mt-3">Literally you probably haven't heard of them jean shorts.</p>
                        </div>
                    </div>
                    <div className="p-4 xl:w-1/3 lg:w-1/2 w-full">
                        <div className="bg-velvet h-full p-6 rounded-lg border-2 border-indigo-500 flex flex-col relative overflow-hidden">
                            <span className="bg-indigo-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
                            <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">PRO</h2>
                            <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                <span>$11.99</span>
                                <span className="text-lg ml-1 font-normal text-gray-400">/mo</span>
                            </h1>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>120 Credits
                            </p>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Fast Response Times
                            </p>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Advanced Rewrite
                            </p>
                            <p className="flex items-center text-gray-400 mb-6">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Limited Document History & Sharing
                            </p>
                            
                            {
                                subscription == "pro" ? (
                                    <button disabled className="flex items-center mt-auto text-white bg-indigo-800 border-0 py-2 px-4 w-full focus:outline-none rounded">
                                        Current
                                    </button>
                                ) : (
                                    <Link href={pro} className='mt-auto'>
                                        <button className="flex items-center mt-auto text-white bg-indigo-600 border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-700 rounded">Select
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </Link>
                                )
                            }

                            <p className="text-xs text-gray-400 mt-3">Literally you probably haven't heard of them jean shorts.</p>
                        </div>
                    </div>
                    <div className="p-4 xl:w-1/3 lg:w-1/2 w-full">
                        <div className="bg-velvet h-full p-6 rounded-lg border-2 border-velvet flex flex-col relative overflow-hidden">
                            <h2 className="text-sm tracking-widest text-gray-400 title-font mb-1 font-medium">EXPERT</h2>
                            <h1 className="text-5xl text-white leading-none flex items-center pb-4 mb-4 border-b border-gray-800">
                                <span>$20.99</span>
                                <span className="text-lg ml-1 font-normal text-gray-400">/mo</span>
                            </h1>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>250 Credits
                            </p>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Fast Response Times
                            </p>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Advanced Rewrite
                            </p>
                            <p className="flex items-center text-gray-400 mb-2">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Unlimited Document History & Sharing
                            </p>
                            <p className="flex items-center text-gray-400 mb-6">
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-800 text-gray-500 rounded-full flex-shrink-0">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>Custom Prompts
                            </p>

                            {
                                subscription == "expert" ? (
                                    <button disabled className="flex items-center mt-auto text-white bg-gray-900 border-0 py-2 px-4 w-full focus:outline-none rounded">
                                        Current
                                    </button>
                                ) : (
                                    <Link href={expert} className='mt-auto'>
                                        <button className="flex items-center mt-auto text-white bg-gray-800 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-700 rounded">
                                            Select
                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </Link>
                                )
                            }

                            <p className="text-xs text-gray-400 mt-3">Literally you probably haven't heard of them jean shorts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer webData={webData} color="bg-purple-dark" />
    </>)
};

export async function getServerSideProps({ req, res }) {
    const { uuid, token, key } = getCookies({ req, res });
    
    const UNSIGNED_PROPS = { redirect: { destination: "/pricing" }};

    if (!(uuid || token || key)) return UNSIGNED_PROPS;

    const query = await db.findOne({ uuid }, "GPTRewrite", "users");
    if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT }};
    const decryptedToken = decrypt(token, key);

    if (!(decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)) return UNSIGNED_PROPS;
    if (query?.admin === "true") return { redirect: { destination: process.env.ADMIN_REDIRECT }};
    if (!query?.access || !query?.access?.includes("rewrite")) return { redirect: { destination: "/waitlist" } };

    if (!['basic', 'pro', 'expert'].includes(query?.subscription)) {
        try {
            await stripe.subscriptions.retrieve(query?.subscriptionId);
        } catch (err) {
            return { redirect: { destination: "/pricing" } };
        }
    }

    return {
        props: {
            avatar: query?.avatar,
            session: true,
            basic: "/api/intent/upgrade/basic",
            pro: "/api/intent/upgrade/pro",
            expert: "/api/intent/upgrade/expert",
            subscription: query?.subscription
        }
    }
}

export default Module;