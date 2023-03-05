import { decrypt } from "../../helpers/decrypt";
import { getCookies } from "cookies-next";
import db from "../../mongo/interact";
import dynamic from "next/dynamic";
import webData from "../../data.json";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "../../helpers/modal";

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = ({ session, avatar, subscription, email, name, nickname }) => {    
    const CancelModal = Modal();
    const [Canceled, SetCanceled] = useState(false);
    const [PwdError, setPwdError] = useState(null);

    return (
        <div className="min-h-screen h-fit w-full" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
            <div className="w-full h-fit sticky top-0 bg-purple-dark">
                <Navbar subscriptionType={subscription} avatarCode={avatar} webSession={session} webData={webData} transparent={true} />
            </div>

            <div className="w-full h-fit p-5">
                <div className="w-full h-fit p-5" tab="1">
                    <h2 className="text-4xl text-white font-bold">Profile</h2>

                    <div className="w-fit h-fit bg-purple-dark rounded-md mt-4 overflow-hidden">
                        <div className="p-5 w-full h-fit bg-velvet">
                            <img
                                className="h-16 w-16 rounded-full"
                                src={`data:image/svg+xml;utf8,${avatar}`}
                                alt=""
                            />
                        </div>
                        <div className="p-5 w-fit h-fit flex gap-5">
                            <div className="flex flex-col">
                                <label>Email</label>
                                <input type="text" placeholder="Email" value={email} className="input input-bordered w-full max-w-xs" disabled />
                            </div>
                            <div className="flex flex-col">
                                <label>Nickname</label>
                                <input type="text" placeholder="Nickname" value={nickname || "none"} className="input input-bordered w-full max-w-xs" disabled />
                            </div>
                            {
                                name ? (
                                    <div className="flex flex-col">
                                        <label>Name</label>
                                        <input type="text" placeholder="Email" value={email} className="input input-bordered w-full max-w-xs" disabled />
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <label style={{ opacity: 0 }}>Add name</label>
                                        <button className="btn btn-primary">Add name</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit p-5" tab="2">
                    <h2 className="text-4xl text-white font-bold">Subscription</h2>

                    <div className="w-fit h-fit p-5 bg-purple-dark rounded-md mt-4">
                        <div className="flex flex-col">
                            <label>Subscription</label>
                            <div className="flex gap-5">
                                <input type="text" placeholder="Email" value={subscription?.toUpperCase() || "FREE"} className="input input-bordered w-full max-w-xs" disabled />
                                <Link href="/pricing">
                                    <button className="btn btn-primary">UPGRADE</button>
                                </Link>

                                { !['basic', 'pro', 'expert'].includes(subscription?.toLowerCase()) ? null : CancelModal.Create({ children: (
                                    <div className="w-full h-full">
                                        <h2 className="text-3xl text-white font-bold">Cancel plan</h2>
                                        <p className="text-gray-300 mt-3">Canceling your plan is irreversable, you will not be provided with a refund. To cancel your plan verify your password below</p>
                                        
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setPwdError(null);

                                            const req = await fetch("/api/intent/cancel", {
                                                method: "POST",
                                                body: document.getElementById("pwd-verify").value
                                            });

                                            const res = await req.json();
                                            if (res?.error) return setPwdError(res.error);

                                            CancelModal.Hide();
                                            SetCanceled(true);
                                        }}>
                                            <div className="flex mt-3 gap-3">
                                                <input id="pwd-verify" type="password" className="py-2 px-3 rounded-md bg-purple-light  border-purple-light border border-2" placeholder="password" required />
                                                <input type="submit" className="py-2 px-3 rounded-md hover:bg-indigo-900 bg-indigo-800 transition-all border-2 border border-indigo-800 hover:border-indigo-900" value="CANCEL"/>
                                            </div>

                                            { PwdError ? <p className="mt-3 text-red-600 text-md">{PwdError}</p> : null }
                                        </form>
                                    </div>
                                ), modalStyles: "bg-purple-dark", open: "CANCEL", styles: "bg-red-500 hover:bg-red-600 text-black" })}

                                { Canceled ? <p className="text-md mt-2 text-green-600">Your plan was canceled successfully.</p> : null }
                            </div>
                        </div>
                    </div>
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
            nickname: query?.nickname || null
        }
    }
}

export default Module;