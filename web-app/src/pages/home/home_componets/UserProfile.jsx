import { useEffect, useState } from 'react';
import {
    RiCalendarLine,
    RiArticleLine,
    RiHeartLine,
    RiChat3Line,
    RiShareForwardLine,
    RiBookmarkLine,
    RiCheckboxCircleFill,
    RiCloseLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function UserProfile() {
    const { id } = useParams();
    const { fetchUserDetailsById, user } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('posts');
    const [showProfileImageModal, setShowProfileImageModal] = useState(false);

    useEffect(() => {
        if (user && user.id === id) {
            navigate('/user/profile', { replace: true });
        }
    }, [user, id, navigate]);

    // Fetch user details by ID
    useEffect(() => {
        const handleFetchUserDetailsById = async () => {
            try {
                const data = await fetchUserDetailsById(id);
                setCurrentUser({
                    id: data.id || '',
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    // email: data.email || '',
                    profileImage: data.profileImage || null,
                    // bio: data.bio || '',
                    blogEntries: Array.isArray(data.blogEntries) ? data.blogEntries : [],
                    createdAt: data.createdAt || '',
                });
            } catch (err) {
                toast.error('Failed to fetch user details');
                console.error('Error fetching user:', err);
            }
        };

        if (id) {
            handleFetchUserDetailsById();
        }
    }, [id, fetchUserDetailsById]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return dateString;
        }
    };

    // Format date and time for posts
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Unknown date/time';
        try {
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return dateString;
        }
    };

    // Format numbers for stats (e.g., posts count)
    const formatNumber = (num) => {
        if (typeof num !== 'number') return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Status badge for blog posts
    const getStatusBadge = (status) => {
        if (!status) return null;
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/30">
                        <RiCheckboxCircleFill className="w-3 h-3" /> Published
                    </span>
                );
            case 'DRAFT':
                return (
                    <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1 rounded-full border border-amber-500/30">
                        Draft
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-500/20 text-gray-400 text-xs font-medium px-3 py-1 rounded-full border border-gray-500/30">
                        {status}
                    </span>
                );
        }
    };

    // Handle profile image click
    const handleProfileImageClick = () => {
        if (currentUser?.profileImage?.url) {
            setShowProfileImageModal(true);
        }
    };

    // Tabs for navigation (only "Posts")
    const tabs = [{ id: 'posts', label: 'Posts', icon: RiArticleLine }];

    // Loading state
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    const name = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Anonymous';
    const userBlogs = currentUser.blogEntries || [];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Header Background */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 h-48 md:h-64">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/30"></div>
            </div>

            {/* Profile Container */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="relative -mt-20 md:-mt-32 pb-8">
                    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 md:p-8 shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            {/* Profile Picture */}
                            <div className="relative">
                                <div
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg cursor-pointer overflow-hidden"
                                    onClick={handleProfileImageClick}
                                >
                                    {currentUser.profileImage?.url ? (
                                        <img
                                            src={currentUser.profileImage.url}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/150';
                                            }}
                                        />
                                    ) : (
                                        <>{currentUser.firstName?.[0] || 'U'}{currentUser.lastName?.[0] || ''}</>
                                    )}
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                                            {currentUser.firstName} {currentUser.lastName}
                                        </h1>
                                        {/* <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm md:text-base">
                                            <RiMailLine className="w-4 h-4" />
                                            {currentUser.email || 'N/A'}
                                        </p> */}
                                        <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm md:text-base">
                                            <RiCalendarLine className="w-4 h-4" />
                                            Joined {formatDate(currentUser.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                {/* <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">
                                    {currentUser.bio || 'No bio available.'}
                                </p> */}
                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                    <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
                                        <div className="text-xl md:text-2xl font-bold text-white">
                                            {formatNumber(currentUser.blogEntries?.length || 0)}
                                        </div>
                                        <div className="text-xs text-gray-400">Posts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-1 mb-6 shadow-lg">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="pb-8">
                    {activeTab === 'posts' && (
                        <div className="space-y-6">
                            {userBlogs.length > 0 ? (
                                userBlogs.filter(Boolean).map((post) => (
                                    <div
                                        key={post.id || Math.random()}
                                        className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                {currentUser.profileImage?.url ? (
                                                    <img
                                                        src={currentUser.profileImage.url}
                                                        className="w-10 h-10 rounded-full object-cover bg-gradient-to-r from-purple-500 to-pink-500"
                                                        alt="Profile"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/40';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                                        {name[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-white">{post.authorName || name}</p>
                                                    <p className="text-xs text-gray-400">{formatDateTime(post.create_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                                {getStatusBadge(post.status)}
                                            </div>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
                                            {post.title || 'Untitled Post'}
                                        </h3>
                                        <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">
                                            {post.content || 'No content available'}
                                        </p>
                                        {post.image?.url && (
                                            <div className="mb-4 rounded-xl overflow-hidden relative group w-full max-w-3xl mx-auto">
                                                <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
                                                    <img
                                                        src={post.image.url}
                                                        alt={post.title || 'Post image'}
                                                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/800x400';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <button className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-red-400 transition-colors">
                                                    <RiHeartLine className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm">{post.likes || 0}</span>
                                                </button>
                                                <button className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                                    <RiChat3Line className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm">{post.comments || 0}</span>
                                                </button>
                                                <button className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-green-400 transition-colors">
                                                    <RiShareForwardLine className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm">{post.shares || 0}</span>
                                                </button>
                                            </div>
                                            <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                                                <RiBookmarkLine className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-lg text-center">
                                    <RiArticleLine className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 text-lg">No posts yet</p>
                                    <p className="text-gray-500 text-sm mt-1">This user hasn't created any blog posts</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* View Profile Image Modal */}
            {showProfileImageModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setShowProfileImageModal(false)}
                            className="absolute top-4 right-4 z-10 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <RiCloseLine className="w-6 h-6" />
                        </button>
                        <div className="bg-transparent rounded-xl overflow-hidden">
                            <img
                                src={currentUser.profileImage.url}
                                alt="Profile"
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/800';
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;