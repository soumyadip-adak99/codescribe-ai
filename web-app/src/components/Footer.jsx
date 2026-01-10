const Footer = () => {
    return (
        <footer className="bg-gray-900  border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* content */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
                    {/* Logo and description */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                CodeScribe AI
                            </span>
                        </h2>
                        <p className="text-gray-400">
                            Transforming ideas into beautifully crafted blogs with the power of artificial intelligence.
                        </p>
                    </div>

                    {/* product links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Product
                        </h3>
                        <ul className="space-y-3">
                            {['Features', 'Pricing', 'Templates', 'API', 'Integrations'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* resource links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {['Documentation', 'Tutorials', 'Blog', 'Community', 'Help Center'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* company links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* divider */}
                <div className="border-t border-gray-800 my-12"></div>

                {/* bottom section */}
                <div className="md:flex md:items-center md:justify-between">
                    {/* contact info */}
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-medium text-white mb-3">Get in Touch</h3>
                        <p className="text-gray-400 mb-4">Have questions? We'd love to hear from you.</p>
                        <a href="mailto:hello@codascribes.ai" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
                            <span className="mr-2">📌</span> io.codescribeai@gmail.com
                        </a>
                    </div>

                    {/* CTA button */}
                    <div className="flex justify-end">
                        <a
                            href="#"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
                        >
                            Start Creating Today
                            <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* copyright */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    © 2025 CodeScribe AI. All rights reserved. Made with ❤️ by the CodeScribe team.
                </div>
                <div className="mt-12 text-center text-red-700 bg-yellow-300 text-sm">
                    This page is currently under development. The data displayed may be incorrect and will be updated once development is complete. 🙏
                </div>
            </div>
        </footer>
    );
};

export default Footer;