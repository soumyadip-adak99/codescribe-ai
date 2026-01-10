import { useState, useEffect, useRef } from "react";
import {
    RiMenuLine,
    RiCloseLine,
    RiUserLine,
    RiSearchLine,
    RiAddLine,
    RiCloseFill,
    RiUploadLine,
    RiLogoutBoxLine,
    RiLockLine,
    RiDeleteBinLine,
} from "react-icons/ri";
import { FaArrowRight, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { userNavItems } from "../../../constants/data";

function Navbar({ activeItem, setActiveItem, email }) {
    const [isMobile, setIsMobile] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [blogData, setBlogData] = useState({
        title: "",
        content: "",
        image: null,
        previewImage: null
    });
    const [resetPasswordData, setResetPasswordData] = useState({
        email: '',
        newPassword: '',
        otp: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, allUsers, fetchAllUsers, logout, uploadBlog, fetchUserDetails, sentOTP, fetchResetPassword, fetchToDeleteAccount } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                (!profileButtonRef.current || !profileButtonRef.current.contains(event.target))) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    const handleNavigation = (item) => {
        setActiveItem(item.label);
        setShowProfileDropdown(false);
        if (item.label === "Search") {
            fetchAllUsers();
            setShowSearchModal(true);
        } else if (item.label === "Create") {
            setShowCreateModal(true);
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate('/login');
            // toast.success('Logged out successfully');
        } catch (err) {
            console.error('Error while logging out:', err);
            toast.error("Something went wrong during logout");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleProfileClick = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    const handleProfileNavigation = () => {
        setActiveItem('Profile');
        navigate('/user/profile');
        setShowProfileDropdown(false);
    };

    const handleSettingsClick = () => {
        setShowSettingsModal(true);
        setShowProfileDropdown(false);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = allUsers
        ?.filter(user =>
            user.email?.toLowerCase() !== "io.codescribeai@gmail.com" && (
                `${user.firstname || ''} ${user.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .slice(0, 4) || [];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogData(prev => ({
                    ...prev,
                    image: file,
                    previewImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setBlogData(prev => ({
            ...prev,
            image: null,
            previewImage: null
        }));
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await uploadBlog(
                { title: blogData.title, content: blogData.content },
                blogData.image
            );

            setShowCreateModal(false);
            setBlogData({
                title: "",
                content: "",
                image: null,
                previewImage: null
            });
            //toast.success('Blog post created successfully');
            await fetchUserDetails();
        } catch (error) {
            toast.error("Failed to upload blog");
            console.error("Error creating blog:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPasswordChange = (e) => {
        const { name, value } = e.target;
        setResetPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const validateResetPasswordField = (name, value) => {
        switch (name) {
            case 'email':
                return /^\S+@\S+\.\S+$/.test(value);
            case 'newPassword':
                return value.length >= 6;
            case 'otp':
                return /^\d{6}$/.test(value);
            default:
                return true;
        }
    };

    const handleSendOtp = async () => {
        if (!validateResetPasswordField('email', resetPasswordData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsResettingPassword(true);
        try {
            await sentOTP(resetPasswordData.email);
            setOtpSent(true);
            setCountdown(30);
            // toast.success('OTP sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to send OTP');
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['email', 'newPassword', 'otp'];
        const isValid = requiredFields.every(field => {
            const valid = validateResetPasswordField(field, resetPasswordData[field]);
            if (!valid) {
                toast.error(`Please enter a valid ${field.replace('_', ' ')}`);
            }
            return valid;
        });

        if (!isValid) return;

        setIsResettingPassword(true);
        try {
            await fetchResetPassword({
                email: resetPasswordData.email,
                newPassword: resetPasswordData.newPassword,
                otp: resetPasswordData.otp
            });
            // toast.success('Password reset successfully! Please login with your new password.');
            setShowResetPasswordModal(false);
            setResetPasswordData({ email: '', newPassword: '', otp: '' });
            setOtpSent(false);
            await logout();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Password reset failed');
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteAccountModal(false);
        setShowDeleteConfirmModal(true);
    };

    const handleConfirmDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            await fetchToDeleteAccount();
            // toast.success('Account deleted successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to delete account');
        } finally {
            setIsDeletingAccount(false);
            setShowDeleteConfirmModal(false);
        }
    };

    const closeModal = () => {
        setShowSearchModal(false);
        setShowCreateModal(false);
        setShowSettingsModal(false);
        setShowResetPasswordModal(false);
        setShowDeleteAccountModal(false);
        setShowDeleteConfirmModal(false);
        setSearchQuery("");
        setBlogData({
            title: "",
            content: "",
            image: null,
            previewImage: null
        });
        setResetPasswordData({ email: '', newPassword: '', otp: '' });
        setOtpSent(false);
        navigate(location);
    };

    const handleUserClick = (user) => {
        closeModal();
        navigate(`/user/profile/${user.id}`, {
            state: { user },
            replace: false
        });
    };

    const handleShowProfileImage = () => {
        if (user?.profileImage?.url) {
            return (
                <img
                    src={user.profileImage.url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500"
                    onError={(e) => (e.target.style.display = 'none')}
                />
            );
        }
        return (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center ring-2 ring-purple-500">
                <RiUserLine className="text-lg text-white" />
            </div>
        );
    };

    return (
        <>
            {/* Mobile Top Header */}
            {isMobile && (
                <header className="fixed top-0 left-0 right-0 bg-gray-950 border-b border-gray-800 z-50 h-14 flex items-center justify-center px-4">
                    <h1 className="font-semibold text-xl text-white tracking-tight">
                        CodeScribe
                        <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            AI
                        </span>
                    </h1>
                </header>
            )}

            {/* Search Modal */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-700 transform transition-all duration-300">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">Search Users</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close search modal"
                            >
                                <RiCloseFill className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-4">
                                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search people . . . ."
                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 transition-all text-sm"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    autoFocus
                                    aria-label="Search users"
                                />
                            </div>
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => handleUserClick(user)}
                                            className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUserClick(user)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {user?.profileImage?.url ? (
                                                    <img
                                                        src={user.profileImage.url}
                                                        alt={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                                                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-500"
                                                        onError={(e) => (e.target.style.display = 'none')}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white ring-1 ring-gray-500">
                                                        {user?.firstName?.[0]?.toUpperCase() || user?.lastName?.[0]?.toUpperCase() || (
                                                            <RiUserLine className="text-xl" />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-white truncate text-sm">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <RiSearchLine className="mx-auto text-3xl text-gray-500 mb-3" />
                                        <p className="text-gray-400 text-sm">No users found</p>
                                        {searchQuery && (
                                            <p className="text-xs text-gray-500 mt-2">Try different search terms</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Blog Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-700 transform transition-all duration-300">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">Create New Blog Post</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close create blog modal"
                            >
                                <RiCloseFill className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleBlogSubmit} className="p-4">
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full px-3 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 transition-all text-sm"
                                    value={blogData.title}
                                    onChange={(e) => setBlogData(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    rows={5}
                                    className="w-full px-3 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 transition-all text-sm"
                                    value={blogData.content}
                                    onChange={(e) => setBlogData(prev => ({
                                        ...prev,
                                        content: e.target.value
                                    }))}
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Featured Image
                                </label>
                                {blogData.previewImage ? (
                                    <div className="relative mb-3">
                                        <img
                                            src={blogData.previewImage}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-gray-900/80 text-white p-1.5 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            aria-label="Remove image"
                                        >
                                            <RiCloseFill className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                                <RiUploadLine className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-400">Upload an image</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                aria-label="Upload featured image"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <RiAddLine className="mr-2 text-lg" />
                                        Publish Blog
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-600/50 transform transition-all duration-300">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">Settings</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close settings modal"
                            >
                                <RiCloseFill className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <button
                                onClick={() => {
                                    setShowResetPasswordModal(true);
                                    setShowSettingsModal(false);
                                }}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <RiLockLine className="mr-3 text-lg" />
                                Reset Password
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteAccountModal(true);
                                    setShowSettingsModal(false);
                                }}
                                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <RiDeleteBinLine className="mr-3 text-lg" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetPasswordModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-600/50 transform transition-all duration-300">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">Reset Password</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close reset password modal"
                            >
                                <RiCloseFill className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">Email</label>
                                <div className="relative">
                                    <FaEnvelope
                                        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={resetPasswordData.email}
                                        onChange={handleResetPasswordChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        required
                                        disabled={isResettingPassword || otpSent}
                                    />
                                </div>
                                {!otpSent && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isResettingPassword || countdown > 0 || !validateResetPasswordField('email', resetPasswordData.email)}
                                        className="w-full mt-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {countdown > 0 ? `Resend (${countdown}s)` : 'Send OTP'}
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1.5 ml-1 text-sm font-medium">New Password</label>
                                <div className="relative">
                                    <RiLockLine
                                        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                    />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="Enter New Password (min 6 characters)"
                                        value={resetPasswordData.newPassword}
                                        onChange={handleResetPasswordChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        required
                                        minLength={6}
                                        disabled={isResettingPassword}
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
                                        value={resetPasswordData.otp}
                                        onChange={handleResetPasswordChange}
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        required
                                        maxLength={6}
                                        pattern="\d{6}"
                                        disabled={isResettingPassword}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isResettingPassword || !otpSent}
                                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isResettingPassword ? 'Processing...' : 'Reset Password'}
                                {!isResettingPassword && <FaArrowRight className="text-sm" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteAccountModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-600/50 transform transition-all duration-300">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">Delete Account</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close delete account modal"
                            >
                                <RiCloseFill className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-300 mb-6 text-sm">
                                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirmModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-600/50 transform transition-all duration-300">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">Confirm Delete Account</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-300 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close confirm delete modal"
                            >
                                <RiCloseFill className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-300 mb-6 text-sm">
                                Please confirm that you want to permanently delete your account. This action is irreversible.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDeleteAccount}
                                    disabled={isDeletingAccount}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {isDeletingAccount ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Confirm Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside
                    className="fixed top-0 left-0 h-screen bg-gray-950 border-r border-gray-800 z-50 flex flex-col w-56 lg:w-64"
                >
                    <div className="flex flex-col p-4 border-b border-gray-800 flex-shrink-0">
                        <h1 className="font-semibold text-xl text-white tracking-tight">
                            CodeScribe
                            <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                AI
                            </span>
                        </h1>
                    </div>

                    <nav className="flex-1 px-4 py-3 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                            {userNavItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavigation(item)}
                                    className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${activeItem === item.label
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                        : 'text-gray-200 hover:bg-gray-800 hover:text-white'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                    aria-current={activeItem === item.label ? 'page' : undefined}
                                >
                                    <span className="mr-3 flex-shrink-0 text-lg">{item.icon}</span>
                                    <span className="font-medium text-sm truncate">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-gray-800 flex-shrink-0 relative" ref={dropdownRef}>
                        <div
                            ref={profileButtonRef}
                            className="flex items-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors"
                            onClick={handleProfileClick}
                            role="button"
                            aria-haspopup="true"
                            aria-expanded={showProfileDropdown}
                        >
                            <div className="flex-shrink-0">
                                {handleShowProfileImage()}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {`${user?.firstname || ''} ${user?.lastName || ''}`.trim() || 'User'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{email}</p>
                            </div>
                        </div>
                        {showProfileDropdown && (
                            <div className="absolute bottom-16 left-4 right-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 overflow-hidden transform transition-all duration-200 ease-out">
                                <button
                                    onClick={handleProfileNavigation}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 hover:text-white transition-colors flex items-center focus:outline-none focus:bg-gray-700 text-sm"
                                    aria-label="View profile"
                                >
                                    <RiUserLine className="mr-3 text-lg" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 hover:text-white transition-colors flex items-center focus:outline-none focus:bg-gray-700 text-sm"
                                    aria-label="Settings"
                                >
                                    <RiLockLine className="mr-3 text-lg" />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-red-600 hover:text-white transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-red-600 text-sm"
                                    aria-label="Log out"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                                            <span>Logging out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <RiLogoutBoxLine className="mr-3 text-lg" />
                                            <span>Log out</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            )}

            {/* Mobile Bottom Navbar */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 z-50 flex justify-around items-center h-16 shadow-lg">
                    {userNavItems
                        .filter(item => item.label !== 'Profile')
                        .map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item)}
                                className={`flex items-center justify-center w-16 h-16 transition-colors duration-200 focus:outline-none ${activeItem === item.label
                                    ? 'text-purple-400'
                                    : 'text-gray-400 hover:text-purple-400'
                                    }`}
                                aria-label={item.label}
                            >
                                <span className="text-2xl">{item.icon}</span>
                            </button>
                        ))}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            ref={profileButtonRef}
                            onClick={handleProfileClick}
                            className={`flex items-center justify-center w-16 h-16 transition-colors duration-200 focus:outline-none ${activeItem === 'Profile'
                                ? 'text-purple-400'
                                : 'text-gray-400 hover:text-purple-400'
                                }`}
                            aria-label="Profile"
                            aria-haspopup="true"
                            aria-expanded={showProfileDropdown}
                        >
                            {handleShowProfileImage()}
                        </button>
                        {showProfileDropdown && (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 overflow-hidden transition-all duration-200 ease-out">
                                <button
                                    onClick={handleProfileNavigation}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 hover:text-white transition-colors flex items-center focus:outline-none text-sm"
                                    aria-label="View profile"
                                >
                                    <RiUserLine className="mr-3 text-lg" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 hover:text-white transition-colors flex items-center focus:outline-none text-sm"
                                    aria-label="Settings"
                                >
                                    <RiLockLine className="mr-3 text-lg" />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-red-600 hover:text-white transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-sm"
                                    aria-label="Log out"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                                            <span>Logging out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <RiLogoutBoxLine className="mr-3 text-lg" />
                                            <span>Log out</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4B5563;
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #374151;
                }

                aside {
                    max-height: 100vh;
                    overflow: hidden;
                }

                @media (max-width: 767px) {
                    .profile-dropdown {
                        bottom: 4.5rem;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }

                @media (min-width: 768px) {
                    aside {
                        width: 224px;
                    }
                }

                @media (min-width: 1024px) {
                    aside {
                        width: 256px;
                    }
                }
            `}</style>
        </>
    );
}

export default Navbar;
