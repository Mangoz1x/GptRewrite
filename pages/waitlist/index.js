import { getCookies } from "cookies-next";
import { decrypt } from "../../helpers/decrypt";
import dynamic from "next/dynamic";
import webData from "../../data.json";
import db from "../../mongo/interact";

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = ({ session, avatar, subscription }) => {
    let filteredWebData = webData;
    filteredWebData.loggedIn.navbar.buttons = filteredWebData.loggedIn.navbar.buttons.filter(button => button.href != "/models/rewrite")
    
    return (
        <div className="min-h-screen h-screen w-full" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
            <div className="w-full h-fit fixed top-0 bg-purple-dark">
                <Navbar subscriptionType={subscription} webSession={session} avatarCode={avatar} webData={webData} transparent={true} />
            </div>

            <div className="flex flex-col justify-center items-center w-full h-full">
                <h1 className="text-5xl font-bold text-white mb-4">Rewrite waitlist</h1>
                <p className="w-1/2 text-lg text-center">You are currently in the Smart Rewrite waitlist, check back in a few days to see if you have been accepted!</p>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    const { uuid, token, key } = getCookies({ req, res });
    if (!(uuid || token || key)) return { props: {} };

    const query = await db.findOne({ uuid }, "GPTRewrite", "users");
    if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT }};
    const decryptedToken = decrypt(token, key);

    if (query.admin === "true") return {
        redirect: {
            destination: process.env.ADMIN_REDIRECT
        }
    }

    if (!(query || decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)) return {
        redirect: {
            destination: process.env.UNSIGNED_REDIRECT
        }
    };

    if (query?.access?.includes("rewrite")) return {
        redirect: {
            destination: "/models/rewrite"
        }
    };

    return {
        props: {
            avatar: query?.avatar,
            session: true,
            subscription: query?.subscription || null
        }
    }
}

export default Module;