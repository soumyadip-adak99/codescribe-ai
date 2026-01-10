import { useState, useEffect, useRef } from "react";
import { FaFacebook, FaDiscord, FaArrowDownLong } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { Link } from "react-router-dom";
import Cards from "./sections/Cards";
import Animation from "../../animation/Animation";
import FeaturesSection from "./sections/FeaturesSection";
import AboutSection from "./sections/AboutSection";
import TeamSection from "./sections/TeamSection";
import DividerLine from "../../constants/DeviderLine";
import Footer from "../../components/Footer";
import './LandingPage.css'
import toast from "react-hot-toast";


function LandingPage() {
    const tagsRef = useRef(null);
    const [showCards, setShowCards] = useState(false);
    const mainContentRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.3) {
                setShowCards(true);
            } else {
                setShowCards(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mainContentRef.current) {
            const viewportHeight = window.innerHeight;
            const contentHeight = mainContentRef.current.offsetHeight;
            const topMargin = Math.max(0, (viewportHeight - contentHeight) / 2 - 50);
            mainContentRef.current.style.marginTop = `${topMargin}px`;
        }

        const handleResize = () => {
            if (mainContentRef.current) {
                const viewportHeight = window.innerHeight;
                const contentHeight = mainContentRef.current.offsetHeight;
                const topMargin = Math.max(0, (viewportHeight - contentHeight) / 2 - 50);
                mainContentRef.current.style.marginTop = `${topMargin}px`;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const tagsContainer = tagsRef.current;
        if (!tagsContainer) return;

        const tags = tagsContainer.querySelectorAll('span');
        const tagWidth = tags[0]?.offsetWidth || 120;
        const gap = 8;

        tags.forEach(tag => {
            const clone = tag.cloneNode(true);
            tagsContainer.appendChild(clone);
        });

        let position = 0;
        const speed = 0.5;
        let animationId;

        const animate = () => {
            position -= speed;

            if (position <= -tagsContainer.scrollWidth / 2) {
                position = 0;
            }

            tagsContainer.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black overflow-hidden relative">

            {/* background animation */}
            <Animation />

            {/* Main content */}
            <div className="relative z-10">
                {/* Header section - centered on initial load */}
                <div
                    ref={mainContentRef}
                    className="flex flex-col items-center justify-center w-full px-4 py-8 transition-all duration-300"
                    data-aos="fade-down"
                >
                    <div className="text-center mb-8 md:mb-12 group max-w-4xl w-full">
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

                    {/* Feature tags */}
                    <div className="relative w-[370px] md:w-[600px] overflow-hidden py-4 mb-3">
                        <div
                            ref={tagsRef}
                            className="flex whitespace-nowrap will-change-transform text-white"
                        >
                            <span className="px-3 py-1 bg-gray-800/30 rounded-full border border-gray-700/50 hover:border-indigo-500/50 transition-colors duration-300 mx-2 cursor-pointer">
                                ✨ AI-Powered Writing Check
                            </span>
                            <span className="px-3 py-1 bg-gray-800/30 rounded-full border border-gray-700/50 hover:border-pink-500/50 transition-colors duration-300 mx-2 cursor-pointer">
                                ⚡ Instant Publishing
                            </span>
                            <span className="px-3 py-1 bg-gray-800/30 rounded-full border border-gray-700/50 hover:border-emerald-500/50 transition-colors duration-300 mx-2 cursor-pointer">
                                ✍️ Generate Blog
                            </span>
                            <span className="px-3 py-1 bg-gray-800/30 rounded-full border border-gray-700/50 hover:border-amber-500/50 transition-colors duration-300 mx-2 cursor-pointer">
                                🔒 Privacy Focused
                            </span>
                        </div>
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md px-4">
                        {/* Create your blog button */}
                        <Link to='/auth/register' className="flex-1 min-w-[180px] sm:min-w-[220px]">
                            <button className="
                                                relative 
                                                group 
                                                w-full
                                                bg-gradient-to-r 
                                                from-[#c00197] via-[#804ef5] to-[#011699] 
                                                text-white 
                                                py-2.5 sm:py-3 
                                                px-4 sm:px-6 
                                                rounded-full 
                                                text-sm sm:text-base 
                                                font-medium 
                                                cursor-pointer 
                                                transition-all 
                                                duration-300 
                                                ease-[cubic-bezier(0.25,1,0.5,1)] 
                                                hover:from-[#c00197] 
                                                hover:via-[#804ef5] 
                                                hover:to-[#011699] 
                                                transform-gpu 
                                                hover:shadow-[0_10px_30px_-5px_rgba(219,2,172,0.4)] 
                                                overflow-hidden 
                                                hover:-translate-y-1 
                                                border 
                                                border-transparent 
                                                hover:border-indigo-300/30 
                                                active:scale-95
                                ">
                                <span className="relative z-10 flex items-center justify-center font-bold whitespace-nowrap">
                                    Create your blog
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[#e817b9] via-[#a855f7] to-[#1a2bff] opacity-0 group-hover:opacity-100 transition-opacity  duration-500" />
                            </button>
                        </Link>

                        {/* Login button */}
                        <Link to="/auth/sing-in" className="flex-1">
                            <button className="relative group w-full bg-transparent border border-indigo-500/40 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-indigo-500/10 hover:border-indigo-400/60 hover:text-indigo-100 transform-gpu hover:shadow-[0_10px_30px_-5px_rgba(67,56,202,0.3)] hover:-translate-y-1 active:scale-95">
                                <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
                                    Sing in
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </span>
                            </button>
                        </Link>
                    </div>

                    {/* Social links */}
                    <div className="mt-12 md:mt-16">
                        <ul className="flex justify-center items-center gap-6 md:gap-8">
                            <li className="group relative">
                                <a href="#" className="flex flex-col items-center transition-all duration-300" aria-label="Facebook">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-300 shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/20">
                                        <FaFacebook size={28} className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                                    </div>
                                    <span className="mt-2 text-xs md:text-sm text-gray-400 group-hover:text-indigo-300 transition-colors duration-300">Facebook</span>
                                </a>
                            </li>
                            <li className="group relative">
                                <a href="#" className="flex flex-col items-center transition-all duration-300" aria-label="Instagram">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-amber-500/10 group-hover:from-pink-500/20 group-hover:to-amber-500/20 transition-all duration-300 shadow-lg shadow-pink-500/10 group-hover:shadow-pink-500/20">
                                        <GrInstagram size={28} className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" />
                                    </div>
                                    <span className="mt-2 text-xs md:text-sm text-gray-400 group-hover:text-pink-300 transition-colors duration-300">Instagram</span>
                                </a>
                            </li>
                            <li className="group relative">
                                <a href="#" className="flex flex-col items-center transition-all duration-300" aria-label="Discord">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-300 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20">
                                        <FaDiscord size={28} className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                                    </div>
                                    <span className="mt-2 text-xs md:text-sm text-gray-400 group-hover:text-blue-300 transition-colors duration-300">Discord</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {!showCards && (

                    <div className="flex items-center justify-center animate-bounce">
                        <FaArrowDownLong className="text-indigo-500 text-2xl" />
                    </div>

                )}


                <div className={`w-full max-w-6xl py-16 px-4 mx-auto transition-all duration-700 ease-out ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    <DividerLine />

                    <Cards />

                    <div className="text-white flex items-center align-center justify-center py-9">
                        <Link to={`auth/register`}
                            onClick={() => toast("Create an account 😊")}
                            className="relative group bg-transparent border border-indigo-500/40 text-white py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg font-medium cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-indigo-500/10 hover:border-indigo-400/60 hover:text-indigo-100 transform-gpu hover:shadow-[0_10px_30px_-5px_rgba(67,56,202,0.3)] hover:-translate-y-1 active:scale-95 flex-1 sm:flex-none">
                            <span className="relative z-10 flex items-center justify-center">
                                Explore More Blogs <FaArrowRight className="pl-2 text-xl" />
                            </span>
                        </Link>
                    </div>

                    <DividerLine />

                    {/* feture section */}
                    <FeaturesSection />

                    <DividerLine />

                    {/* aboutsection */}
                    <AboutSection />

                    <DividerLine />



                </div>
                <div className={`w-full ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <TeamSection />
                </div>

                <div className={`w-full ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default LandingPage;