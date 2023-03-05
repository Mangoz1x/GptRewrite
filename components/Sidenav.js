import Link from "next/link";

const Module = () => {
    const changeDropDownArrow = (e) => {
        const { checked } = e.target;

        const dropdown = [...e.target.parentElement.getElementsByClassName("arrow-dropdown")];
        if (dropdown.length < 1) return;

        if (checked)
            dropdown[0].style.transform = "rotate(180deg)";
        else
            dropdown[0].style.transform = "";
    }

    return (
        <aside className="fixed top-0 left-0 w-64 h-full" aria-label="Sidenav">
            <div className="overflow-y-auto py-5 px-3 h-full border-r bg-gray-800 border-gray-700">
                <ul className="space-y-2">
                    <li>
                        <Link href="/user/admin">
                            <button className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group">
                                <svg aria-hidden="true" className="w-6 h-6 transition duration-75 text-gray-400 group-hover group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                <span className="ml-3">Overview</span>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <div className="collapse">
                            <input type="checkbox" onChange={changeDropDownArrow} style={{ minHeight: "fit-content" }} />
                            <div style={{ minHeight: "fit-content", paddingRight: "12px" }} className="collapse-title flex border border-gray-700 items-center py-2 w-full text-base font-normal rounded-lg transition duration-75 group text-white">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Data</span>
                                <svg className="arrow-dropdown w-6 h-6 transition-all duration-300" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </div>
                            <div className="collapse-content" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                                <div className="w-full pt-2 h-fit"></div>
                                <div className="flex gap-2 flex-col w-full">
                                    <Link href="/user/admin">
                                        <button className="flex items-center p-2 pl-12 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">
                                            <span className="ml-1">Categories</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapse">
                            <input type="checkbox" onChange={changeDropDownArrow} style={{ minHeight: "fit-content" }} />
                            <div style={{ minHeight: "fit-content", paddingRight: "12px" }} className="collapse-title flex border border-gray-700 items-center py-2 w-full text-base font-normal rounded-lg transition duration-75 group text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                </svg>                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Database</span>
                                <svg className="arrow-dropdown w-6 h-6 transition-all duration-300" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </div>
                            <div className="collapse-content" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
                                <div className="w-full pt-2 h-fit"></div>
                                <div className="flex gap-2 flex-col w-full">
                                    <button disabled className="flex items-center p-2 pl-12 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">
                                        <span className="ml-1">Query</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 group">
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                            <span className="flex-1 ml-3 whitespace-nowrap">Messages</span>
                            <span className="inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 bg-primary-200 text-primary-800">
                                6
                            </span>
                        </a>
                    </li>
                    <li>
                        <button type="button" className="flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700" aria-controls="dropdown-authentication" data-collapse-toggle="dropdown-authentication">
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                            <span className="flex-1 ml-3 text-left whitespace-nowrap">Authentication</span>
                            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                        <ul id="dropdown-authentication" className="hidden py-2 space-y-2">
                            <li>
                                <a href="#" className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">Sign In</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">Sign Up</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group text-white hover:bg-gray-700">Forgot Password</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 border-gray-700">
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group">
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                            <span className="ml-3">Docs</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group">
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
                            <span className="ml-3">Components</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 text-white group">
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 transition duration-75 text-gray-400 group-hover group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path></svg>
                            <span className="ml-3">Help</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-gray-800 z-20">
                <a href="#" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer text-gray-400 hover hover:text-white hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>
                </a>
                <a href="#" data-tooltip-target="tooltip-settings" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer text-gray-400 hover:text-white hover hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                </a>
                <div id="tooltip-settings" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip">
                    Settings page
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        </aside>
    )
};

export default Module;