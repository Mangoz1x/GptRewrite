import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import { getCookies } from "cookies-next";
import dynamic from "next/dynamic";

const Sidenav = dynamic(() => import("../../../components/Sidenav"));

const Module = ({ email }) => {
    return (
        <div className="w-full min-h-screen h-fit flex">
            <Sidenav />
            <div style={{ flexGrow: 0, flexShrink: 0, flexBasis: "auto" }} className="min-h-64 w-64 h-screen"></div>
            <div style={{ flexGrow: 1, flexShrink: "100%", flexBasis: "100%" }} className="p-4 bg-gray-900 w-full h-screen">
                <input type="text" disabled value={email} className="rounded-md px-5 py-2" />
            </div>
        </div>
    )
};


export async function getServerSideProps({ req, res }) {
    const { uuid, token, key } = getCookies({ req, res });
    if (!(uuid || token || key)) return { 
        redirect: { 
            destination: process.env.UNSIGNED_REDIRECT
        }
    };
    
    const query = await db.findOne({ uuid }, "PublicModelLibrary", "users");
    const decryptedToken = decrypt(token, key);

    if (!query || decrypt(query.token, process.env.ENCRYPTION_KEY) !== decryptedToken) return { 
        redirect: { 
            destination: process.env.UNSIGNED_REDIRECT
        }
    };

    if (query.admin !== "true") return {
        redirect: {
            destination: "/user"
        }
    }

    return { 
        props: {
            session: true,
            email: query.email
        }
    }
}

export default Module;