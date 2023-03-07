import { decrypt } from "../../helpers/decrypt";
import { getCookies } from "cookies-next";
import db from "../../mongo/interact";
import dynamic from "next/dynamic";
import webData from "../../data.json";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "../../helpers/modal";

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = ({ session, avatar, subscription, ytmp4, uuid, key, token }) => {
    const [url, setUrl] = useState(null);
    const [converted, setConverted] = useState(0);

    const convert = async () => {
        if (!url) return;

        const request = await fetch(`${webData.ytmp4URL}?url=${url}`, {
            method: "POST",
            body: new URLSearchParams({ uuid: uuid, key: key, token: token })
        });

        const body = request.body;
        const reader = body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            let text = decoder.decode(value);
            text = text.split("[{end}]").join("");
            text = text.split("[{seperate}]"); 
            
            if (text?.[0] == 'download') {
                const percentage = text?.[1];
                setConverted(Number(percentage));
            }
        }
    }

    return (
        <div className="min-h-screen h-fit w-full" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
            <div className="w-full h-fit sticky top-0 bg-purple-dark">
                <Navbar ytmp4={ytmp4} subscriptionType={subscription} avatarCode={avatar} webSession={session} webData={webData} transparent={true} />
            </div>

            <div className="w-full h-fit p-5">
                <div className="w-full h-fit p-5">
                    <h2 className="text-4xl text-white font-bold">Convert</h2>

                    <div className="w-full flex flex-col mt-8">
                        <label className="mb-1 text-gray-400">Youtube Video URL</label>

                        <div className="flex gap-4">
                            <input onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=youtubeid" type="text" className="input input-primary w-1/2" />
                            <button className="btn btn-primary" onClick={convert}>CONVERT</button>
                        </div>

                        <div className="w-full flex flex-col mt-4">
                            <label>*All youtube videos will be downloaded at full quality</label>
                        </div>
                    </div>
                    {
                        converted > 0 ? (
                            <div className="flex flex-col w-full mt-4">
                                <label className="mb-1 text-gray-400">Converting ({converted}%)</label>
                                <div className="bg-gray-900 rounded-md w-full h-8 overflow-hidden">
                                    <div className="bg-purple-700 h-full transition-all duration-500" style={{ width: `${converted}%` }}></div>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
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

    const query = await db.findOne({ uuid }, "GPTRewrite", "users");
    if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT } };
    const decryptedToken = decrypt(token, key);

    if (!query || decrypt(query.token, process.env.ENCRYPTION_KEY) !== decryptedToken) return {
        redirect: {
            destination: process.env.UNSIGNED_REDIRECT
        }
    };

    if (!query?.access?.includes("ytmp4")) return {
        redirect: {
            destination: "/waitlist"
        }
    }

    if (query.admin === "true") return {
        redirect: {
            destination: process.env.ADMIN_REDIRECT
        }
    }

    return {
        props: {
            session: true,
            avatar: query?.avatar,
            email: query.email,
            subscription: query?.subscription || null,
            name: query?.name || null,
            nickname: query?.nickname || null,
            ytmp4: query?.access?.includes("ytmp4") ? true : false,
            uuid,
            key,
            token
        }
    }
}

export default Module;