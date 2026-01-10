import { useEffect, useState } from "react";
import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Animation from "../animation/Animation";
import LandingHeader from "./LandingHeader";

function Login() {
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, 4000)
    }, [error])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
        } catch (err) {
            if (err.response && err.response.status === 500 || err.response.status == 401) {
                setError({ message: "Invalid email or password" });
            } else {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <Animation />
            <LandingHeader />

            <div className="flex items-center justify-center min-h-screen relative z-10 px-4 py-12">
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-900/50 backdrop-blur-lg border border-gray-600/50 rounded-2xl p-8 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text">
                        Welcome Back
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-300 mb-2 ml-1 text-sm font-medium">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2 ml-1 text-sm font-medium">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 text-sm">{error.message || "Invalid credentials"}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`w-full relative group py-3 px-6 rounded-lg font-medium transition-all duration-300 transform-gpu ${!isFormValid || loading
                                ? 'bg-[#3A4359] text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] hover:-translate-y-1 active:scale-95'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? 'Signing In...' : 'Sign In'}
                                {(!loading && isFormValid) && (
                                    <FaArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                )}
                            </span>
                        </button>

                        <div className="text-center pt-4">
                            <Link to="/auth/reset-password" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-300">
                                Forgot password?
                            </Link>
                            <p className="text-gray-500 text-sm mt-4">
                                Don't have an account?{' '}
                                <Link to="/auth/register" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
