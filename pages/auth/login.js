import webData from "../../data.json";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getCookies } from "cookies-next";
import db from "../../mongo/interact";
import { decrypt } from "../../helpers/decrypt";
import { useRouter } from 'next/router';

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = () => {
    const [error, setError] = useState("");    
    const router = useRouter()

    const el = (name) => Array.from(document.getElementsByName(name))?.[0];

    const handleForm = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const email = el("email")?.value;
        const password = el("password")?.value;
        
        if (!(password || email))    
            return setError("Please fill out all fields");

        const request = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        const response = await request.json();
        if (response.error) return setError(response.error);

        const params = (new URL(document.location)).searchParams;
        const redirect = params.get("redirect");

        if (redirect) {
            const url = `${window.location.origin}${redirect}`;
            router.push(url);
        } else {
            window.location.reload();
        }
    }

    return (<>
        <div className="w-full sm:h-screen h-fit min-h-screen flex flex-col items-center justify-center" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}> 
            <div className="w-full h-fit">
                <Navbar webData={webData} transparent={true} />
            </div>

            <section className="h-fit my-auto w-full flex items-center">
                <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 w-full mx-auto h-fit lg:py-0 mt-[-32px] sm:mt-[-88px]">
                    <div className="w-full h-full sm:h-fit rounded-lg border md:mt-0 sm:max-w-md xl:p-0 bg-purple-light border-purple-light shadow-md">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Sign in to an account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleForm}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-purple-dark border-purple-dark placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                    <input autoComplete="true" type="password" name="password" id="password" placeholder="••••••••" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-purple-dark border-purple-dark placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required="" />
                                </div>
                                <div>
                                    <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary hover:bg-purple-800 transition-all focus:ring-primary-800">Sign in</button>
                                    <p className="mt-1 text-red-500 text-sm">{error}</p>
                                </div>
                                <p className="text-sm font-light text-gray-500 text-gray-400">
                                    Don't have an account? <a href="/auth/signup" className="font-medium hover:underline text-blue-500">Create one here</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
};

export async function getServerSideProps({ req, res }) {
    const { uuid, token, key } = getCookies({ req, res });
    if (!(uuid || token || key)) return { props: {}};
    
    const query = await db.findOne({ uuid }, "GPTRewrite", "users");
    const decryptedToken = decrypt(token, key);
    if (!query || decrypt(query.token, process.env.ENCRYPTION_KEY) !== decryptedToken) return { props: {}};

    if (query.admin === "true") return {
        redirect: {
            destination: process.env.ADMIN_REDIRECT
        }
    }

    return { 
        redirect: {
            destination: process.env.SIGNED_REDIRECT
        }
    }
}

export default Module;