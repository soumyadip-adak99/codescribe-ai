import { Link } from "react-router-dom"

export default function LandingHeader() {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 py-4 backdrop-blur-sm z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center md:justify-start">
                        <Link to={"/"}>
                            <h2 className="text-white text-3xl font-bold tracking-tight">
                                CodeScribe
                                <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
                                    AI
                                </span>
                            </h2>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
