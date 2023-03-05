import Head from 'next/head'
import dynamic from "next/dynamic";
import Link from "next/link";
import webData from "../../../data.json";
import { getCookies } from 'cookies-next';
import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import gateway from "stripe";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripe = gateway(process.env.STRIPE_KEY);
const client = loadStripe("pk_test_51MaKfOBL31fVfU1SzFrdMkpVPXWXtWEUHItf9t0Xxl1G5IXEMBShK5s3RZSW95Cx7VoqT5pDokHgpznKnCQKiLsC00E98xkIak");

const Navbar = dynamic(() => import("../../../components/Navbar"));
const Payment = dynamic(() => import("../../../components/Payment"));

const Module = ({ avatar, amount, secret, id, plan, features }) => {
    const appearance = {
        theme: 'night',
        variables: {
            fontFamily: 'Sohne, system-ui, sans-serif',
            fontWeightNormal: '500',
            borderRadius: '8px',
            colorBackground: '#100624',
            colorPrimary: '#100624',
            colorPrimaryText: '#1A1B25',
            colorText: 'white',
            colorTextSecondary: 'white',
            colorTextPlaceholder: '#727F96',
            colorIconTab: 'white',
            colorLogo: 'dark',
            spacingUnit: '4px',
            spacingGridRow: "10px"
        },
        rules: {
            '.Input, .Block': {
                border: '1.5px solid var(--colorPrimary)',
                boxShadow: 'none'
            },
        }
    };

    const options = {
        clientSecret: secret,
        appearance,
    };

    return (
        <div style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }} className="w-full h-fit min-h-[100vh]">
            <div className="w-full h-fit" style={{ zIndex: 9 }}>
                <Navbar webData={webData} avatarCode={avatar} session={true} transparent={true} scrollFade={true} />
            </div>

            <div className="w-full h-fit flex items-center flex-col">
                <div className='container w-full h-full px-0 md:px-5 lg:px-10 p-10 flex flex-col lg:flex-row'>
                    <div className="p-4 w-full lg:w-1/2">
                        <h1 className="text-5xl text-white font-bold">${amount}CAD</h1>

                        <div className="hidden lg:block">
                            <h2 className="text-md text-gray-200 mt-4">Selected plan: {plan.toUpperCase()}</h2>
                            <h2 className="text-md text-gray-200">Currency: CAD</h2>

                            <label className='mt-4 block text-2xl text-white'>Features</label>
                            <ul className="list-disc text-gray-200 list-inside mt-1">
                                { features.map(feature => (
                                    <li className="ml-4" key={feature}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 block lg:hidden">
                            <div className="collapse bg-purple-dark rounded-md">
                                <input type="checkbox" /> 
                                <div className="collapse-title text-xl font-medium">
                                    Details
                                </div>
                                <div className="collapse-content"> 
                                    <p>Selected plan: {plan}</p>
                                    <p>Currency: CAD</p>

                                    <p className="mt-4 text-xl text-white">Features</p>
                                    <ul className="list-disc text-gray-200 list-inside">
                                        { features.map(feature => (
                                            <li className="ml-4" key={feature}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 h-fit lg:bg-purple-dark p-4 rounded-md'>
                        <h1 className="text-2xl md:text-3xl text-white md:font-bold mb-6">Payment information</h1>
                        <Elements options={options} stripe={client}>
                            <Payment secret={secret} id={id} />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    )
};

export async function getServerSideProps(req, res) {
    try {
        const { uuid, token, key } = getCookies({ req: req.req, res: req.res });
        if (!(uuid || token || key)) return { redirect: { destination: `/auth/signup?redirect=/pricing/buy/${req.query.plan || "basic"}` } };

        const query = await db.findOne({ uuid }, "GPTRewrite", "users");
        if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT } };
        const decryptedToken = decrypt(token, key);

        if (!(decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)) return UNSIGNED_PROPS;
        if (query?.admin === "true") return { redirect: { destination: process.env.ADMIN_REDIRECT } };
        if (!query?.access || !query?.access?.includes("rewrite")) return { redirect: { destination: "/waitlist" } };

        // Create stripe intent
        const { plan, secret, subscription } = req.query;
        if (!["basic", "pro", "expert"].includes(plan)) return {
            redirect: { destination: "/pricing" }
        };

        const plans = { basic: 4.99, pro: 11.99, expert: 20.99 };
        const selected = plans[plan];
        if (!(selected || secret || subscription)) return { redirect: { destination: "/pricing" } };

        const stripeSubscription = await stripe.subscriptions.retrieve(subscription);
        if (stripeSubscription?.status == "active" && stripeSubscription?.metadata?.plan?.toLowerCase() == plan?.toLowerCase()) return { redirect: { destination: `/pricing/complete/${stripeSubscription.id}` }}
        if (stripeSubscription?.status == "active") return { redirect: { destination: "/pricing/upgrade" }};
        
        const features = {
            basic: ["55 Credits", "Fast Response Times", "Basic Rewrite Features"],
            pro: ["120 Credits", "Fast Response Times", "Advanced Rewrite Features", "Limited Document History & Sharing"],
            expert: ["250 Credits", "Fast Response Times", "Advanced Rewrite Features", "Unlimited Document History & Sharing", "Custom Prompts"]
        }

        return {
            props: {
                secret: secret,
                id: stripeSubscription?.id,
                amount: selected,
                avatar: query.avatar,
                plan: plan,
                features: features[plan]
            }
        }
    } catch (err) {
        return {
            redirect: {
                destination: `/pricing?error=${err.message}`
            }
        }
    }
}

export default Module;