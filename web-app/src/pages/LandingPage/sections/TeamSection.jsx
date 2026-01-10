import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { teamMembers } from "../../../constants/data";

const TeamSection = () => {
    const [hoveredMember, setHoveredMember] = useState(null);

    return (
        <div className="relative pb-30 px-4 sm:px-6 lg:px-8 bg-transperent overflow-hidden">
            {/* background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 blur-[80px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500 blur-[80px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* header */}
                <div className="text-center mb-16" data-aos='fade-left'>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Meet the <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Developers</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        The brilliant minds behind CodeScribe AI
                    </p>
                </div>

                {/* members */}
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredMember(index)}
                            onMouseLeave={() => setHoveredMember(null)}
                            className="relative group w-full sm:w-[45%] md:w-[30%] lg:w-[18%] max-w-xs transition-all duration-300"
                            data-aos='fade-up'
                        >
                            {/* card container */}
                            <div className="flex flex-col items-center text-center  py-3 rounded-2xl border-1 border-gray-700">
                                {/* circular image with hover effect */}
                                <div className="relative mb-4 w-40 h-40 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-indigo-500 transition-all duration-300">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>

                                {/* member info */}
                                <div className="w-full">
                                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                    <p className={`text-sm font-medium mb-3 ${hoveredMember === index ? 'text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text' : 'text-gray-400'}`}>
                                        {member.role}
                                    </p>

                                    {/* social links */}
                                    <div className="flex justify-center gap-4 mt-3">
                                        <a
                                            href={member.gitHub}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            <FaGithub className="w-5 h-5" />
                                        </a>
                                        <a
                                            href={member.linkdin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                        >
                                            <FaLinkedin className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamSection;