import { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa6";

function LandingPage() {

    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = clientX / window.innerWidth;
            const y = clientY / window.innerHeight;

            setMousePos({ x, y });

            // Set CSS custom properties for backup
            document.documentElement.style.setProperty('--mouse-x', x);
            document.documentElement.style.setProperty('--mouse-y', y);

            // Professional cursor follower effect
            const cursorFollower = document.querySelector('.cursor-follower');
            if (cursorFollower) {
                cursorFollower.style.transform = `translate(${clientX - 128}px, ${clientY - 128}px)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">
            {/* Professional cursor follower */}
            <div className="cursor-follower fixed w-64 h-64 rounded-full pointer-events-none transition-transform duration-300 ease-out z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(219,2,172,0.08) 0%, rgba(219,2,172,0.02) 50%, transparent 70%)',
                    filter: 'blur(40px)'
                }} />

            {/* Subtle animated grid overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-5 animate-pulse"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    animationDuration: '4s'
                }} />

            {/* Dynamic background elements with React state */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(219,2,172,0.06) 0%, rgba(219,2,172,0.02) 40%, transparent 70%)`
                    }}
                />

                <div
                    className="absolute top-0 left-0 w-full h-full transition-all duration-1200 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${(1 - mousePos.x) * 100}% ${(1 - mousePos.y) * 100}%, rgba(1,26,189,0.04) 0%, rgba(67,56,202,0.02) 40%, transparent 70%)`
                    }}
                />

                {/* Additional floating elements */}
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 transition-all duration-2000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center items-center min-h-screen px-4 py-8 relative z-10">
                {/* Animated Header */}
                <div className="text-center mb-8 md:mb-12 group max-w-4xl">
                    <div className="mb-4 md:mb-6">
                        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 md:mb-4 transition-all duration-500 ease-out hover:scale-[1.02] leading-tight">
                            Welcome To
                        </h1>
                        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold transition-all duration-500 ease-out hover:scale-[1.02] leading-tight">
                            CodeScribe
                            <span className="ml-2 md:ml-3 text-transparent font-bold bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-500 hover:from-indigo-300 hover:via-purple-300 hover:to-pink-300 animate-pulse">
                                AI
                            </span>
                        </h2>
                    </div>
                    <p className="text-gray-400 mt-4 md:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto transition-all duration-300 hover:text-gray-300 leading-relaxed px-4">
                        Transform your ideas into beautifully crafted blogs
                    </p>
                </div>

                {/* Enhanced feature highlights */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 text-xs sm:text-sm text-gray-500 max-w-2xl">
                    <span className="px-3 py-1 bg-gray-800/30 rounded-full border border-gray-700/50 hover:border-indigo-500/50 transition-colors duration-300">
                        ✨ AI-Powered Writing Check
                    </span>

                    <span className="px-3 py-1 bg-gray-800/30 rounded-full border border-gray-700/50 hover:border-pink-500/50 transition-colors duration-300">
                        ⚡ Instant Publishing
                    </span>
                </div>

                {/* Professional responsive buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md px-4">
                    <button className="
                        relative group
                        bg-gradient-to-r from-[#db02ac] via-[#8b5cf6] to-[#011abd] 
                        text-white py-3 md:py-4 px-6 md:px-8 rounded-full 
                        text-base md:text-lg font-medium 
                        cursor-pointer 
                        transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                        hover:from-[#e817b9] hover:via-[#a855f7] hover:to-[#1a2bff]
                        transform-gpu
                        hover:shadow-[0_10px_30px_-5px_rgba(219,2,172,0.4)]
                        overflow-hidden
                        hover:-translate-y-1
                        border border-transparent hover:border-indigo-300/30
                        active:scale-95
                        flex-1 sm:flex-none
                    ">
                        <span className="relative z-10 flex items-center justify-center">
                            Create your blog
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#e817b9] via-[#a855f7] to-[#1a2bff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>

                    <button className="
                        relative group
                        bg-transparent
                        border border-indigo-500/40
                        text-white py-3 md:py-4 px-6 md:px-8 rounded-full 
                        text-base md:text-lg font-medium
                        cursor-pointer 
                        transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                        hover:bg-indigo-500/10
                        hover:border-indigo-400/60
                        hover:text-indigo-100
                        transform-gpu
                        hover:shadow-[0_10px_30px_-5px_rgba(67,56,202,0.3)]
                        hover:-translate-y-1
                        active:scale-95
                        flex-1 sm:flex-none
                    ">
                        <span className="relative z-10 flex items-center justify-center">
                            Log in
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Enhanced Social Links Section */}
                <div className="mt-12 md:mt-16">
                    <ul className="flex justify-center items-center gap-6 md:gap-8">
                        <li className="group relative">
                            <a
                                href="#"
                                className="flex flex-col items-center transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <div className="
                                            p-3 rounded-full 
                                            bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                                            group-hover:from-indigo-500/20 group-hover:to-purple-500/20
                                            transition-all duration-300
                                            shadow-lg shadow-indigo-500/10
                                            group-hover:shadow-indigo-500/20
                                        ">
                                    <FaFacebook
                                        size={28}
                                        className="
                                            text-indigo-400 
                                            group-hover:text-indigo-300 
                                            transition-colors duration-300
                                        "
                                    />
                                </div>
                                <span className="
                                        mt-2 text-xs md:text-sm 
                                        text-gray-400 
                                        group-hover:text-indigo-300 
                                        transition-colors duration-300
                                    ">
                                    Facebook
                                </span>
                            </a>
                        </li>

                        <li className="group relative">
                            <a
                                href="#"
                                className="flex flex-col items-center transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <div className="
                                        p-3 rounded-full 
                                        bg-gradient-to-br from-pink-500/10 to-amber-500/10
                                        group-hover:from-pink-500/20 group-hover:to-amber-500/20
                                        transition-all duration-300
                                        shadow-lg shadow-pink-500/10
                                        group-hover:shadow-pink-500/20
                                    ">
                                    <GrInstagram
                                        size={28}
                                        className="
                                            text-pink-400 
                                            group-hover:text-pink-300 
                                            transition-colors duration-300
                                        "
                                    />
                                </div>
                                <span className="
                                        mt-2 text-xs md:text-sm 
                                        text-gray-400 
                                        group-hover:text-pink-300 
                                        transition-colors duration-300
                                    ">
                                    Instagram
                                </span>
                            </a>
                        </li>

                        <li className="group relative">
                            <a
                                href="#"
                                className="flex flex-col items-center transition-all duration-300"
                                aria-label="Discord"
                            >
                                <div className="
                                            p-3 rounded-full 
                                            bg-gradient-to-br from-blue-500/10 to-indigo-500/10
                                            group-hover:from-blue-500/20 group-hover:to-indigo-500/20
                                            transition-all duration-300
                                            shadow-lg shadow-blue-500/10
                                            group-hover:shadow-blue-500/20
                                        ">
                                    <FaDiscord
                                        size={28}
                                        className="
                                            text-blue-400 
                                            group-hover:text-blue-300 
                                            transition-colors duration-300
                                        "
                                    />
                                </div>
                                <span className="
                                            mt-2 text-xs md:text-sm 
                                            text-gray-400 
                                            group-hover:text-blue-300 
                                            transition-colors duration-300
                                        ">
                                    Discord
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile-specific enhancements */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .cursor-follower {
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}

export default LandingPage