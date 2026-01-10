import { useState, useEffect } from "react";
import { FaArrowRight, FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Animation from "../animation/Animation";
import LandingHeader from "./LandingHeader";

function Register() {
    const { registration, sentOTP } = useAuth();
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        otp: ''
    });

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return /^\S+@\S+\.\S+$/.test(value);
            case 'password':
                return value.length >= 6;
            case 'otp':
                return /^\d{6}$/.test(value);
            case 'firstname':
            case 'lastname':
                return value.trim().length > 0;
            default:
                return true;
        }
    };

    const handleSendOtp = async () => {
        if (!validateField('email', formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await sentOTP(formData.email);
            setOtpSent(true);
            setCountdown(30);
            // toast.success('OTP sent to your email');
        } catch (error) {
            toast.error(error.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate all fields
        const requiredFields = ['firstname', 'lastname', 'email', 'password'];
        const isValid = requiredFields.every(field => {
            const valid = validateField(field, formData[field]);
            if (!valid) {
                toast.error(`Please enter a valid ${field.replace('_', ' ')}`);
            }
            return valid;
        });

        if (!isValid) return;

        if (!otpSent || !validateField('otp', formData.otp)) {
            toast.error('Please verify your email with OTP first');
            return;
        }

        setLoading(true);
        try {
            await registration(formData);
            toast.success('Registration successful! Please login.');
            navigate('/auth/sign-in');
        } catch (error) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <Animation />
            <LandingHeader />

            <div className="flex items-center justify-center min-h-screen relative z-10 px-4 py-12">
                <form onSubmit={handleSubmit}
                    className="w-full max-w-md bg-gray-900/50 backdrop-blur-lg border border-gray-600/50 rounded-2xl p-8 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-500 mt-9">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text">
                        Create Account
                    </h2>

                    <div className="space-y-5">
                        {/* name fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">First
                                    Name</label>
                                <div className="relative">
                                    <FaUser
                                        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="Enter First Name"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">Last Name</label>
                                <div className="relative">
                                    <FaUser
                                        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Enter Last Name"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* email */}
                        <div>
                            <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">Email</label>
                            <div className="relative">
                                <FaEnvelope
                                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    required
                                    disabled={loading || otpSent}
                                />
                            </div>
                            {!otpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading || countdown > 0 || !validateField('email', formData.email)}
                                    className="w-full mt-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {countdown > 0 ? `Resend (${countdown}s)` : 'Send OTP'}
                                </button>
                            )}
                        </div>

                        {/* password */}
                        <div>
                            <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">Password</label>
                            <div className="relative">
                                <FaLock
                                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {otpSent && (
                            <div>
                                <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                    required
                                    maxLength={6}
                                    pattern="\d{6}"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !otpSent}
                            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : 'Register'}
                            {!loading && <FaArrowRight className="text-sm" />}
                        </button>

                        <div className="text-center pt-1">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link to="/auth/sing-in"
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;