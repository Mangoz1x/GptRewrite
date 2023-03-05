import dynamic from "next/dynamic";
import webData from "../../../data.json";
import { getCookies } from 'cookies-next';
import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import gateway from "stripe";

const Navbar = dynamic(() => import("../../../components/Navbar"));
const stripe = gateway(process.env.STRIPE_KEY)

const Module = ({ subscription, avatar, plan, features }) => {
    return (
        <div style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }} className="w-full h-[100vh]">
            <div className="w-full h-fit fixed top-0" style={{ zIndex: 9 }}>
                <Navbar subscriptionType={subscription} webData={webData} avatarCode={avatar} session={true} transparent={true} scrollFade={true} />
            </div>

            <div className="flex justify-center items-center flex-col px-5 w-full h-full">
                <h1 className="text-5xl text-white font-bold">Your subscription has been upgraded!</h1>
                <p className="text-center w-full px-10 md:px-0 md:w-1/2 mt-4">Your {plan.toLowerCase()} plan includes {features.join(", ")}</p>
            </div>
        </div>
    )
};

export default Module;

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
        if (!query?.subscription || !query.subscriptionId) return { redirect: { destination: "/pricing?error=invalid%20params" } };

        let stripeSubscription = null;
        
        try {
            stripeSubscription = await stripe.subscriptions.retrieve(query.subscriptionId);
        } catch (err) {
            return { redirect: { destination: "/pricing?err=no%20subscription%20upgrade" }}
        }
        
        if (stripeSubscription?.plan?.active !== true || stripeSubscription?.status !== "active") return { redirect: { destination: `/pricing?error=intent%20not%20complete` }};

        const features = {
            basic: ["55 Credits", "Fast Response Times", "Basic Rewrite Features"],
            pro: ["120 Credits", "Fast Response Times", "Advanced Rewrite Features", "Limited Document History & Sharing"],
            expert: ["250 Credits", "Fast Response Times", "Advanced Rewrite Features", "Unlimited Document History & Sharing", "Custom Prompts"]
        }

        const sub = stripeSubscription?.metadata?.plan || query?.subscription;

        return {
            props: {
                amount: stripeSubscription.plan.amount,
                avatar: query.avatar,
                plan: sub,
                features: features[sub],
                subscription: sub
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