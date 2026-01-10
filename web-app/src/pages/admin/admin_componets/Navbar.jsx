import { useState, useEffect, useRef } from "react";
import {
    RiAdminFill,
    RiLogoutBoxLine,
    RiMenuLine,
    RiCloseLine,
    RiEditLine,
    RiUserLine,
    RiMailLine,
    RiPhoneLine,
    RiCalendarLine,
    RiShieldLine,
    RiSaveLine,
    RiCloseCircleLine,
    RiInformationLine,
    RiShareLine,
    RiMore2Line
} from "react-icons/ri";
import { adminNavItems } from "../../../constants/data";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ activeItem, setActiveItem, email, logout }) {
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);

    const [userProfile, setUserProfile] = useState({
        name: "Admin User",
        email: email || "admin@example.com",
        phone: "+1 (555) 123-4567",
        role: "Administrator",
        joinDate: "January 15, 2024",
        department: "IT Management",
        bio: "System Administrator responsible for managing user accounts, security, and system operations.",
        lastUpdated: new Date().toLocaleDateString()
    });

    const [editableProfile, setEditableProfile] = useState({ ...userProfile });

    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth < 768;
            setIsMobile(mobileView);
            setSidebarOpen(false); // Always close sidebar on resize
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setUserProfile(prev => ({ ...prev, email: email || "admin@example.com" }));
        setEditableProfile(prev => ({ ...prev, email: email || "admin@example.com" }));
    }, [email]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setShowProfileDropdown(false);
    };

    const handleProfileClick = () => {
        if (isMobile) {
            setShowProfileDropdown(!showProfileDropdown);
        } else {
            setShowProfile(true);
            setIsEditing(false);
        }
    };

    const handleSaveProfile = () => {
        const updatedProfile = {
            ...editableProfile,
            lastUpdated: new Date().toLocaleDateString()
        };
        setUserProfile(updatedProfile);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditableProfile({ ...userProfile });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditableProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const closeModal = () => {
        setShowProfile(false);
        setIsEditing(false);
        setEditableProfile({ ...userProfile });
    };

    const handleNavigation = (item) => {
        setActiveItem(item.label);
        if (isMobile) {
            setSidebarOpen(false);
            setShowProfileDropdown(false);
        }
        navigate(item.path);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setShowProfileDropdown(false);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const renderProfileImage = () => (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <RiAdminFill className="text-lg" />
        </div>
    );

    return (
        <>
            {/* Loading Overlay */}
            {isLoggingOut && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white font-medium text-lg">Logging out...</p>
                    </div>
                </div>
            )}

            {/* Mobile Header */}
            {isMobile && (
                <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 h-16 shadow-sm">
                    <div className="flex items-center justify-between px-4 h-full">
                        <h1 className='text-center font-bold text-xl text-white tracking-tight'>
                            CodeScribe
                            <span className='ml-1 text-transparent font-bold bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'>
                                AI
                            </span>
                        </h1>
                    </div>
                </header>
            )}

            {/* Overlay for Sidebar */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Profile Modal */}
            {showProfile && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-opacity duration-300"
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-700 transform transition-all duration-300 ease-out">
                        <div className="relative p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-t-2xl">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white hover:text-gray-200 hover:scale-110 transition-transform duration-300"
                                aria-label="Close modal"
                            >
                                <RiCloseLine className="text-xl" />
                            </button>

                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white mb-4 backdrop-blur-sm border-2 border-white/30 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                                    <RiAdminFill className="text-4xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-white text-center">{userProfile.name}</h2>
                                <div className="mt-1 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                    <p className="text-purple-100 text-sm font-medium">{userProfile.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            <div className="flex justify-between mb-6">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md group-hover:shadow-lg"
                                    >
                                        <RiEditLine className="mr-2" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3 w-full">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md group-hover:shadow-lg flex-1"
                                        >
                                            <RiSaveLine className="mr-2" />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md group-hover:shadow-lg flex-1"
                                        >
                                            <RiCloseCircleLine className="mr-2" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-5">
                                {[
                                    { icon: <RiUserLine />, label: "Full Name", field: "name", type: "text" },
                                    { icon: <RiMailLine />, label: "Email", field: "email", type: "email" },
                                    { icon: <RiPhoneLine />, label: "Phone", field: "phone", type: "tel" },
                                    {
                                        icon: <RiShieldLine />,
                                        label: "Department",
                                        field: "department",
                                        type: "select",
                                        options: ["IT Management", "Engineering", "Design", "Marketing", "Sales", "HR"]
                                    },
                                    { icon: <RiCalendarLine />, label: "Join Date", field: "joinDate", type: "text", readOnly: true },
                                ].map(({ icon, label, field, type, options, readOnly }) => (
                                    <div key={field} className="flex items-start gap-3 group">
                                        <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/30 group-hover:scale-105 transition-all duration-300">
                                            {icon}
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                                            {isEditing && !readOnly ? (
                                                type === "select" ? (
                                                    <select
                                                        value={editableProfile[field]}
                                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none group-hover:shadow-md transition-all duration-300"
                                                    >
                                                        {options.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={type}
                                                        value={editableProfile[field]}
                                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none group-hover:shadow-md transition-all duration-300"
                                                        placeholder={`Enter your ${label.toLowerCase()}`}
                                                    />
                                                )
                                            ) : (
                                                <p className="text-white font-medium break-words">
                                                    {userProfile[field] || `No ${label.toLowerCase()} provided`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-2 group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/30 group-hover:scale-105 transition-all duration-300">
                                            <RiInformationLine className="text-purple-400 text-lg" />
                                        </div>
                                        <label className="block text-sm font-medium text-gray-300">Bio</label>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            value={editableProfile.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none group-hover:shadow-md transition-all duration-300"
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <p className="text-gray-300 text-sm leading-relaxed pl-11">
                                            {userProfile.bio || "No bio provided"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Last updated: {userProfile.lastUpdated}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-purple-400 hover:scale-110 transition-all duration-300">
                                        <RiShareLine />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-purple-400 hover:scale-110 transition-all duration-300">
                                        <RiMore2Line />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="fixed top-0 left-0 h-screen bg-gray-800 border-r border-gray-700 z-50 flex flex-col w-64 transition-all duration-300 ease-in-out">
                    <div className="flex flex-col p-6 border-b border-gray-700 flex-shrink-0">
                        <h1 className='font-bold text-2xl text-white tracking-tight'>
                            CodeScribe
                            <span className='ml-1 text-transparent font-bold bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'>
                                AI
                            </span>
                        </h1>
                        <div className="mt-2 text-xs text-gray-400 flex items-center">
                            <RiAdminFill className="mr-1" />
                            <span>ADMIN PANEL</span>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                        {adminNavItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item)}
                                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 text-left group ${activeItem === item.label
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md hover:scale-[1.02]'
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            >
                                <span className={`mr-3 flex-shrink-0 text-lg transition-transform group-hover:scale-110 group-hover:text-purple-400 ${activeItem === item.label ? 'text-white' : 'text-gray-400'
                                    }`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-700 flex-shrink-0 relative" ref={dropdownRef}>
                        <div
                            ref={profileButtonRef}
                            className="flex items-center cursor-pointer hover:bg-gray-700 rounded-lg p-2 transition-all duration-300 group hover:shadow-md hover:scale-[1.02]"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            role="button"
                            aria-haspopup="true"
                            aria-expanded={showProfileDropdown}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                                <RiAdminFill className="text-xl" />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate group-hover:text-purple-200 transition-colors duration-300">Admin User</p>
                                <p className="text-xs text-gray-400 truncate group-hover:text-purple-300 transition-colors duration-300">{email}</p>
                            </div>
                        </div>

                        {showProfileDropdown && (
                            <div className="absolute bottom-16 left-4 right-4 bg-gray-700 rounded-lg shadow-xl border border-gray-600 z-10 overflow-hidden transform transition-all duration-300 ease-out">
                                <button
                                    onClick={() => {
                                        setShowProfile(true);
                                        setShowProfileDropdown(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-600 hover:text-purple-200 transition-all duration-300 flex items-center focus:outline-none focus:bg-gray-600 text-sm hover:scale-[1.02] hover:shadow-md"
                                >
                                    <RiUserLine className="mr-3 text-lg group-hover:text-purple-400 transition-colors duration-300" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`w-full px-4 py-3 text-left text-gray-200 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center focus:outline-none focus:bg-red-600 text-sm hover:scale-[1.02] hover:shadow-md ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <RiLogoutBoxLine className="mr-3 text-lg group-hover:text-white transition-colors duration-300" />
                                    <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            )}


            {isMobile && !sidebarOpen && (
                <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50 flex justify-around items-center h-16 shadow-lg backdrop-blur-sm bg-opacity-90">
                    {adminNavItems
                        .filter(item => item.label !== 'Profile')
                        .map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item)}
                                className={`flex flex-col items-center justify-center w-1/5 h-full transition-all duration-300 focus:outline-none relative group ${activeItem === item.label ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
                                    }`}
                                aria-label={item.label}
                            >
                                <span className="text-2xl group-hover:scale-110 group-hover:text-purple-400 transition-all duration-300">
                                    {item.icon}
                                </span>
                                <span className="text-[10px] mt-1 font-medium group-hover:text-purple-300 transition-colors duration-300">
                                    {item.label}
                                </span>
                                {activeItem === item.label && (
                                    <div className="absolute -top-px w-8 h-1 bg-purple-500 rounded-b-full" />
                                )}
                            </button>
                        ))}
                    <div className="relative w-1/5 h-full flex items-center justify-center" ref={dropdownRef}>
                        <button
                            ref={profileButtonRef}
                            onClick={handleProfileClick}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 focus:outline-none relative group ${showProfileDropdown || activeItem === 'Profile' ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
                                }`}
                            aria-label="Profile"
                            aria-haspopup="true"
                            aria-expanded={showProfileDropdown}
                        >
                            {renderProfileImage()}
                            <span className="text-[10px] mt-1 font-medium group-hover:text-purple-300 transition-colors duration-300">
                                Profile
                            </span>
                            {(showProfileDropdown || activeItem === 'Profile') && (
                                <div className="absolute -top-px w-8 h-1 bg-purple-500 rounded-b-full" />
                            )}
                        </button>
                        {showProfileDropdown && (
                            <div className="absolute bottom-16 -right-4 w-48 bg-gray-700 rounded-lg shadow-xl border border-gray-600 z-10 overflow-hidden transition-all duration-300 ease-out">
                                <button
                                    onClick={() => {
                                        setShowProfile(true);
                                        setShowProfileDropdown(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-600 hover:text-purple-200 transition-all duration-300 flex items-center focus:outline-none focus:bg-gray-600 text-sm hover:scale-[1.02] hover:shadow-md"
                                >
                                    <RiUserLine className="mr-3 text-lg group-hover:text-purple-400 transition-colors duration-300" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`w-full px-4 py-3 text-left text-gray-200 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center focus:outline-none focus:bg-red-600 text-sm hover:scale-[1.02] hover:shadow-md ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <RiLogoutBoxLine className="mr-3 text-lg group-hover:text-white transition-colors duration-300" />
                                    <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            )}

            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.5);
                    border-radius: 3px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 3px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.8);
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </>
    );
}

export default Navbar;