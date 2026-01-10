import { useState } from "react";
import { assets } from "../../../assets/assets";
import { stats } from "../../../constants/data";

const AboutSection = () => {
    const [hoveredStat, setHoveredStat] = useState(null);



    return (
        <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 blur-[80px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500 blur-[80px]"></div>
            </div>

            <h2 data-aos='fade-right' className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                About <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CodeScribe AI</span>
            </h2>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                    {/* Image section - appears first on mobile, on right on desktop */}
                    <div className="lg:order-2 w-full lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square shadow-xl" data-aos='fade-left'>
                            <img
                                src={assets.aboutImage}
                                alt="CodeScribe AI team working"
                                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                    </div>

                    {/* Text content */}
                    <div className="lg:order-1 w-full lg:w-1/2 animate-fadeIn">


                        <p data-aos='fade-up' className="text-lg md:text-xl text-gray-400 mb-6 leading-relaxed animate-fadeIn delay-100">
                            We're passionate about democratizing content creation through the power of artificial intelligence. Our mission is to empower creators, entrepreneurs, and businesses to share their stories without the traditional barriers of time and expertise.
                        </p>

                        <p data-aos='fade-up' className="text-lg md:text-xl text-gray-400 leading-relaxed animate-fadeIn delay-200">
                            Founded in 2024, CodeScribe AI emerged from the simple belief that everyone has valuable ideas worth sharing. Our cutting-edge AI technology bridges the gap between inspiration and publication, making professional-quality content creation accessible to all.
                        </p>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fadeInUp" data-aos='fade-up'>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredStat(index)}
                            onMouseLeave={() => setHoveredStat(null)}
                            className="relative group transition-all duration-300"
                        >
                            <div className={`absolute inset-0 rounded-xl border border-gray-800 transition-all duration-300 ${hoveredStat === index ? 'border-transparent' : ''}`}></div>

                            {/* Hover background effect */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 ${index % 2 === 0 ? 'from-purple-500/10 to-pink-500/10' : 'from-indigo-500/10 to-blue-500/10'} transition-opacity duration-300 ${hoveredStat === index ? 'opacity-100' : ''}`}></div>

                            <div className="relative z-10 p-6 text-center">
                                <div className="text-4xl mb-3 transition-all duration-300">
                                    <span className={`inline-block transition-all duration-300 ${hoveredStat === index ? 'scale-110 text-white' : 'text-gray-400'}`}>
                                        {stat.icon}
                                    </span>
                                </div>

                                <h3 className={`text-3xl font-bold mb-2 transition-all duration-300 ${hoveredStat === index ? 'text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text' : 'text-white'}`}>
                                    {stat.value}
                                </h3>

                                <p className={`text-sm uppercase tracking-wider transition-all duration-300 ${hoveredStat === index ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {stat.label}
                                </p>
                            </div>

                            {/* Hover indicator */}
                            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${hoveredStat === index ? 'opacity-100 w-16' : 'opacity-0 w-0'} h-0.5 bg-gradient-to-r from-indigo-400 to-pink-400`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutSection;