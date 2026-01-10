const LoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-black p-6 md:p-8 flex flex-col items-center justify-center">
            {/* Logo/Title Skeleton - Animated gradient */}
            <div className="w-full max-w-md mb-10 md:mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-[shimmer_2s_infinite]"></div>
                <div className="h-7 md:h-8 bg-gray-900 rounded w-3/4 mb-3 md:mb-4 mx-auto relative"></div>
                <div className="h-10 md:h-12 bg-gray-900 rounded w-full mb-2 mx-auto relative"></div>
            </div>

            {/* Tagline Skeleton - With subtle delay */}
            <div className="w-full max-w-lg mb-12 md:mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-[shimmer_2s_infinite] animation-delay-100"></div>
                <div className="h-5 md:h-6 bg-gray-900 rounded w-5/6 mx-auto relative"></div>
            </div>

            {/* Main Button Skeleton - Pulse with shimmer */}
            <div className="w-56 md:w-64 h-12 md:h-14 bg-gray-900 rounded-lg mb-10 md:mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>

            {/* Features Skeleton - Staggered animation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl mb-12 md:mb-16">
                {[1, 2, 3].map((item, index) => (
                    <div key={item} className="flex flex-col items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-[shimmer_2s_infinite]"
                            style={{ animationDelay: `${index * 0.1}s` }}></div>
                        <div className="h-5 md:h-6 w-5 md:w-6 bg-gray-900 rounded-full mb-2 md:mb-3 relative"></div>
                        <div className="h-3 md:h-4 bg-gray-900 rounded w-3/4 relative"></div>
                    </div>
                ))}
            </div>

            {/* Secondary Button Skeleton */}
            <div className="w-40 md:w-48 h-10 md:h-12 bg-gray-900 rounded-lg mb-12 md:mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-[shimmer_2s_infinite] animation-delay-200"></div>
            </div>

            {/* Social Icons Skeleton - Circular shimmer */}
            <div className="flex space-x-4 md:space-x-6">
                {[1, 2, 3].map((item, index) => (
                    <div key={item} className="h-8 md:h-10 w-8 md:w-10 bg-gray-900 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-[shimmer_2s_infinite]"
                            style={{ animationDelay: `${index * 0.15}s` }}></div>
                    </div>
                ))}
            </div>

            {/* Custom shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-\\[shimmer_2s_infinite\\] {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingSkeleton;