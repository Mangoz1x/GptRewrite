import { getCookies } from "cookies-next";
import db from "../../mongo/interact";
import { decrypt } from "../../helpers/decrypt";
import dynamic from "next/dynamic";
import webData from "../../data.json";
import { useState } from "react";
import Link from "next/link";
import AOS from 'aos';
import "aos/dist/aos.css";

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = ({ session, avatar, subscription }) => {
    const [text, setText] = useState("");
    const [rephrased, setRephrased] = useState(null);
    const [error, setError] = useState("");
    const [estimatedTime, setEstimatedTime] = useState(null);

    let data = {
        level: "Grade 10",
        personality: "Student",
        wording: "Fun and unique but commonly used"
    };

    useState(() => {
        if (typeof window === "undefined") return;
        AOS.init();
    }, []);

    const rewrite = async () => {
        const parsedText = text.split(" ").join("");
        if (!parsedText || parsedText == "") {
            setRephrased("Please enter a valid GPT response to rephrase.");
            return setError(true);
        }

        let calculatedTime = (80 * (text.split(" ").length)) / 1000;
        let ogTime = calculatedTime;
        setEstimatedTime([calculatedTime, ogTime]);
        setRephrased("");
        setError(false);

        const intervalRateS = 0.1;
        const timeremaining = setInterval(() => {
            if (calculatedTime-intervalRateS < 0) {
                calculatedTime = 0;
                clearInterval(timeremaining);
                return setEstimatedTime([0, ogTime]);
            }

            calculatedTime = calculatedTime-intervalRateS;
            setEstimatedTime([calculatedTime, ogTime]);
        }, intervalRateS * 1000);

        const request = await fetch("/api/gpt/rewrite", {
            method: "POST",
            body: JSON.stringify({
                text: text,
                level: data.level, 
                personality: data.personality, 
                wording: data.wording
            })
        });

        const response = await request.json();
        if (response?.error) {
            setError(true);
            clearInterval(timeremaining);
            setEstimatedTime(null);
            return setRephrased(response.error);
        }

        clearInterval(timeremaining);
        setEstimatedTime(null);
        setRephrased(response.generated);
    }

    return (
        <div className="min-h-screen h-fit w-full" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
            <div className="w-full h-fit sticky top-0 bg-purple-dark">
                <Navbar subscriptionType={subscription} webSession={session} avatarCode={avatar} webData={webData} transparent={true} />
            </div>

            <div className="h-fit w-full">
                <h1 className="px-10 pt-10 text-xl text-white font-bold">REWRITE TEXT</h1>

                <div className="w-full px-5 sm:px-10 py-2 mx-auto">
                    <textarea 
                        onInput={function (e) {
                            setText(e.target.value);

                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }} 
                        placeholder="Paste you're text here..." 
                        className="min-h-[100px] outline-none p-2 w-full h-full rounded-md bg-purple-light-600"
                    ></textarea>


                    <div className="mt-6 md:mt-0 gap-4 md:gap-8 flex h-fit w-full md:py-10 flex-col md:flex-row">
                        <div className="flex flex-col w-full md:w-fit h-fit md:mr-auto">
                            <label htmlFor="level" className="mb-2" style={{ opacity: 0 }}>Done</label>
                            <button onClick={rewrite} className="w-full md:w-fit btn btn-primary">REWRITE</button>
                        </div>

                        <div className="flex flex-col w-full md:w-fit h-fit">
                            <label htmlFor="level" className="mb-2">Select a writing style</label>
                            
                            <select onChange={(e) => {
                                const value = e.target.value;
                                data.level = value || "Grade 10";
                            }} id="level" defaultValue="Grade 10" className="w-full select border-none bg-purple-light-600 md:w-fit">
                                { webData["writing-levels"].map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col w-full md:w-fit h-fit">
                            <label htmlFor="personalities" className="mb-2">Select a personality</label>
                            
                            <select onChange={(e) => {
                                const value = e.target.value;
                                data.personality = value || "Student";
                            }} id="personalities" defaultValue="Student" className="w-full select border-none bg-purple-light-600 md:w-fit">
                                { webData["writing-personalities"].map(personality => (
                                    <option key={personality} value={personality}>{personality}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col w-full md:w-fit h-fit">
                            <label htmlFor="wording" className="mb-2">Select a wording scheme</label>
                            
                            <select onChange={(e) => {
                                const value = e.target.value;
                                data.wording = value || "Fun and unique but commonly used";
                            }} id="wording" defaultValue="Fun and unique but commonly used" className="w-full select border-none bg-purple-light-600 md:w-fit">
                                { webData["writing-wording"].map(wording => (
                                    <option key={wording} value={wording}>{wording}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h2 className="text-xl text-white font-bold mb-2 md:mt-0 mt-10">OUTPUT</h2>
                    <div className={`min-h-[100px] outline-none p-2 w-full rounded-md bg-purple-light-600 ${ error ? "text-red-500" : ""}`}>
                        { rephrased ? rephrased : estimatedTime?.length > 1 ? (
                            <div className="w-full h-fit flex justify-center items-center py-4">
                                <div className="radial-progress bg-purple-dark" style={{"--value": ((estimatedTime[1] - estimatedTime[0]) / estimatedTime[1]) * 100 }}>{(((estimatedTime[1] - estimatedTime[0]) / estimatedTime[1]) * 100).toFixed(1)}%</div>
                            </div>
                        ) : `Waiting for response...`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    try {
        const { uuid, token, key } = getCookies({ req, res });
        if (!(uuid || token || key)) return { redirect: {destination: process.env.UNSIGNED_REDIRECT} };
    
        const query = await db.findOne({ uuid }, "GPTRewrite", "users");
        if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT }};
        const decryptedToken = decrypt(token, key);
    
        if (query?.admin === "true") return {
            redirect: {
                destination: process.env.ADMIN_REDIRECT
            }
        }
    
        if (!(query || decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)) return {
            redirect: {
                destination: process.env.UNSIGNED_REDIRECT
            }
        };
    
        if (!query?.access || !query?.access?.includes("rewrite")) return {
            redirect: {
                destination: "/waitlist"
            }
        };
    
        return {
            props: {
                avatar: query?.avatar,
                session: true,
                subscription: query?.subscription || null
            }
        }
    } catch (err) {
        return {
            redirect: {
                destination: process.env.UNSIGNED_REDIRECT
            }
        }
    }
}

export default Module;