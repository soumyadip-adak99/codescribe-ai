import { useState } from "react";
import { features } from "../../../constants/data";


const FeaturesSection = () => {
    const [hoveredItem, setHoveredItem] = useState(null);



    return (
        <>
            <div className="bg-transparent py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section header */}
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Why Use <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CodeScribe AI</span>?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                            Discover the power of AI-driven content creation that transforms your ideas into engaging, professional blogs
                        </p>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div data-aos='fade-up'>
                                <div
                                    key={index}
                                    className={`relative p-6 rounded-2xl border border-gray-800 transition-all duration-500 ease-out ${hoveredItem === index ? 'border-transparent' : ''}`}
                                    onMouseEnter={() => setHoveredItem(index)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {/* Hover background effect */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 ${feature.gradient} transition-opacity duration-500 ${hoveredItem === index ? 'opacity-20' : ''}`}
                                    ></div>

                                    {/* Glow effect */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl opacity-0 ${hoveredItem === index ? 'opacity-100' : ''} transition-opacity duration-500`}
                                        style={{
                                            boxShadow: `0 0 30px 5px rgba(var(--${feature.gradient.split(' ')[0].split('-')[1]}-500), 0.3)`
                                        }}
                                    ></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className={`text-4xl mb-4 transition-transform duration-300 ${hoveredItem === index ? 'scale-110' : ''}`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent transition-all duration-300 ${hoveredItem === index ? 'text-white' : ''}`}>
                                            {feature.title}
                                        </h3>
                                        <p className={`text-gray-400 transition-all duration-300 ${hoveredItem === index ? 'text-gray-300' : ''}`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
};

export default FeaturesSection;