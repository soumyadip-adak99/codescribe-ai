import { useState, useEffect } from 'react';
import {
    RiUserLine, RiMailLine, RiCalendarLine,
    RiEditLine, RiBookmarkLine, RiChat3Line, RiShareForwardLine, RiMoreFill, RiCheckboxCircleFill,
    RiGlobalLine, RiStarLine, RiTrophyLine, RiCodeSSlashLine, RiArticleLine,
    RiHeartLine, RiDeleteBinLine, RiCloseLine, RiImageLine, RiUploadLine
} from 'react-icons/ri';
import { useAuth } from '../../../context/AuthContext';
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";

function Profile() {
    const { user, fetchToDeleteBlog, fetchToProfileImageUpload, fetchToUpdateBlogById, fetchUserDetails } = useAuth();
    const { userId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        firstname: '',
        lastName: '',
        email: '',
    });

    // State for blog post actions
    const [selectedPost, setSelectedPost] = useState(null);
    const [showPostMenu, setShowPostMenu] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedPost, setEditedPost] = useState({
        title: '',
        content: '',
    });

    // Profile image states
    const [showProfileImageModal, setShowProfileImageModal] = useState(false);
    const [showProfileImageEditModal, setShowProfileImageEditModal] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initialize user data with proper null checks
    const [currentUser, setCurrentUser] = useState({
        id: userId || user?.id || "",
        firstname: user?.firstname || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        joinDate: "2023-01-15",
        profileImage: user?.profileImage || null,
        userBlogs: Array.isArray(user?.blogs) ? user.blogs : [],
    });

    useEffect(() => {
        setEditedUser({
            firstname: currentUser.firstname || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            bio: currentUser.bio || ''
        });
    }, [currentUser]);

    useEffect(() => {
        fetchUserDetails();
    }, [editedUser, profileImageFile, currentUser.userBlogs]);

    const [activeTab, setActiveTab] = useState('posts');
    const getAllUserBlogs = currentUser.userBlogs || [];

    // TODO : remove in future
    const userBlogs = [...getAllUserBlogs].reverse()

    const name = `${currentUser.firstname || ''} ${currentUser.lastName || ''}`.trim() || 'Anonymous';

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setCurrentUser(prev => ({
            ...prev,
            ...editedUser
        }));
        setIsEditing(false);
        toast.success('Profile updated successfully');
    };

    // Profile image handlers
    const handleProfileImageClick = () => {
        if (currentUser.profileImage) {
            setShowProfileImageModal(true);
        } else {
            setShowProfileImageEditModal(true);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileImageUpload = async () => {
        if (!profileImageFile) return;

        setIsUploading(true);
        try {
            const response = await fetchToProfileImageUpload(profileImageFile);
            setCurrentUser(prev => ({
                ...prev,
                profileImage: response.url || URL.createObjectURL(profileImageFile)
            }));
            toast.success('Profile image updated successfully');
            setShowProfileImageEditModal(false);
            setProfileImageFile(null);
            setProfileImagePreview(null);
        } catch (error) {
            toast.error('Failed to upload profile image');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const removeProfileImage = () => {
        setCurrentUser(prev => ({
            ...prev,
            profileImage: null
        }));
        setShowProfileImageModal(false);
        setShowProfileImageEditModal(true);
        toast.success('Profile image removed');
    };

    // Blog post actions
    const togglePostMenu = (postId) => {
        setShowPostMenu(showPostMenu === postId ? null : postId);
    };

    const handleEditPost = (post) => {
        if (!post) return;

        setSelectedPost(post);
        setEditedPost({
            title: post.title || '',
            content: post.content || '',
            image: post.image?.url || null
        });
        setShowPostMenu(null);
        setShowEditModal(true);
    };

    const handleDeletePost = (post) => {
        if (!post) return;

        setSelectedPost(post);
        setShowPostMenu(null);
        setShowDeleteModal(true);
    };

    const handlePostInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedPost(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setEditedPost(prev => ({
            ...prev,
            image: null
        }));
    };

    const savePostChanges = async () => {
        if (!selectedPost) return;

        try {
            setLoading(true);
            await fetchToUpdateBlogById(selectedPost.id, editedPost);

            setCurrentUser(prev => ({
                ...prev,
                userBlogs: prev.userBlogs.map(post =>
                    post?.id === selectedPost.id ? { ...post, ...editedPost } : post
                ).filter(Boolean)
            }));

            setShowEditModal(false);
            toast.success('Post updated successfully');
        } catch (error) {
            toast.error("Blog Update Failed");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const confirmDeletePost = async () => {
        if (!selectedPost) return;

        try {
            setLoading(true);
            await handleDeleteBlog(selectedPost.id);
            setCurrentUser(prev => ({
                ...prev,
                userBlogs: prev.userBlogs.filter(post => post?.id !== selectedPost.id)
            }));
            setShowDeleteModal(false);
            // toast.success('Post deleted successfully');
        } catch (error) {
            toast.error("Failed to delete post");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            await fetchToDeleteBlog(id);
        } catch (error) {
            toast.error("Delete failed.");
            throw error;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Unknown date/time';
        try {
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (status) => {
        if (!status) return null;

        switch (status.toUpperCase()) {
            case 'PUBLISHED':
                return <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/30">
                    <RiCheckboxCircleFill className="w-3 h-3" /> Published
                </span>;
            case 'DRAFT':
                return <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1 rounded-full border border-amber-500/30">
                    Draft
                </span>;
            default:
                return <span className="bg-gray-500/20 text-gray-400 text-xs font-medium px-3 py-1 rounded-full border border-gray-500/30">
                    {status}
                </span>;
        }
    };

    const formatNumber = (num) => {
        if (typeof num !== 'number') return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const tabs = [
        { id: 'posts', label: 'Posts', icon: RiArticleLine },
    ];

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
                                    {currentUser.profileImage ? (
                                        <img
                                            src={currentUser.profileImage.url || currentUser.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            {currentUser.firstname?.[0] || 'U'}{currentUser.lastName?.[0] || ''}
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowProfileImageEditModal(true)}
                                    className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    <RiEditLine className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    value={editedUser.firstname}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                                    placeholder="First name"
                                                />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={editedUser.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                                    placeholder="Last name"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                                    {currentUser.firstname} {currentUser.lastName}
                                                </h1>
                                                <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm md:text-1xl">
                                                    <RiMailLine className="w-4 h-4" />
                                                    {currentUser.email}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleSave}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleEditToggle}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={handleEditToggle}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto cursor-pointer"
                                            >
                                                <RiEditLine className="w-4 h-4" />
                                                <span className="whitespace-nowrap">Edit Profile</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={editedUser.bio}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mb-6"
                                        rows="3"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">
                                        {currentUser.bio}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                    <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
                                        <div className="text-xl md:text-2xl font-bold text-white">
                                            {formatNumber(currentUser.userBlogs.length || 0)}
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
                                    <div key={post.id || Math.random()}
                                        className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                {(currentUser?.profileImage?.url || currentUser?.profileImage) ? (
                                                    <img
                                                        src={currentUser.profileImage.url || currentUser.profileImage}
                                                        className="w-10 h-10 rounded-full object-cover bg-gradient-to-r from-purple-500 to-pink-500"
                                                        alt="Profile"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                                        {name[0]}
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-medium text-white">{name}</p>
                                                    <p className="text-xs text-gray-400">{formatDateTime(post.create_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                                {getStatusBadge(post.status)}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => togglePostMenu(post.id)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <RiMoreFill className="w-5 h-5" />
                                                    </button>
                                                    {showPostMenu === post.id && (
                                                        <div
                                                            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                                                            <button
                                                                onClick={() => handleEditPost(post)}
                                                                className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer"
                                                            >
                                                                <RiEditLine className="mr-2" />
                                                                Edit Post
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePost(post)}
                                                                className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer"
                                                            >
                                                                <RiDeleteBinLine className="mr-2" />
                                                                Delete Post
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg md:text-xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
                                            {post.title || 'Untitled Post'}
                                        </h3>

                                        <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">
                                            {post.content || 'No content available'}
                                        </p>

                                        {post.image?.url && (
                                            // <div className="mb-4 rounded-xl overflow-hidden">
                                            //     <img
                                            //         src={post.image.url}
                                            //         alt={post.title || 'Post image'}
                                            //         className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
                                            //     />
                                            // </div>
                                            <div className="mb-4 rounded-xl overflow-hidden relative group w-full max-w-3xl mx-auto">
                                                <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
                                                    <img
                                                        src={post.image.url}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/800x400';
                                                        }}
                                                    />
                                                    {/* <div
                                                        className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                        <span className="text-white text-sm font-medium">View full image</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <button
                                                    className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-red-400 transition-colors">
                                                    <RiHeartLine className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm">{post.likes || 0}</span>
                                                </button>
                                                <button
                                                    className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                                    <RiChat3Line className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm">{post.comments || 0}</span>
                                                </button>
                                                <button
                                                    className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-green-400 transition-colors">
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
                                <div
                                    className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-lg text-center">
                                    <RiArticleLine className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 text-lg">No posts yet</p>
                                    <p className="text-gray-500 text-sm mt-1">You haven't created any blog posts</p>
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
                                src={currentUser.profileImage.url || currentUser.profileImage}
                                alt="Profile"
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => {
                                    setShowProfileImageModal(false);
                                    setShowProfileImageEditModal(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <RiEditLine className="w-4 h-4" />
                                Edit Image
                            </button>
                            <button
                                onClick={removeProfileImage}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <RiDeleteBinLine className="w-4 h-4" />
                                Remove Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Image Modal */}
            {showProfileImageEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {currentUser.profileImage ? 'Update Profile Image' : 'Upload Profile Image'}
                            </h3>
                            <button
                                onClick={() => setShowProfileImageEditModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col items-center justify-center mb-6">
                                {profileImagePreview || currentUser.profileImage ? (
                                    <div className="relative mb-4">
                                        <img
                                            src={profileImagePreview || (currentUser.profileImage.url || currentUser.profileImage)}
                                            alt="Profile preview"
                                            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-2 border-gray-700"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl md:text-6xl font-bold text-white mb-4">
                                        {currentUser.firstname?.[0] || 'U'}{currentUser.lastName?.[0] || ''}
                                    </div>
                                )}
                                <label className="cursor-pointer">
                                    <div
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                        <RiUploadLine className="w-4 h-4" />
                                        {profileImagePreview ? 'Change Image' : 'Select Image'}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={() => setShowProfileImageEditModal(false)}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProfileImageUpload}
                                    disabled={!profileImageFile && !currentUser.profileImage}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${(!profileImageFile && !currentUser.profileImage)
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    {isUploading ? 'Uploading...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Edit Blog Post</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editedPost.title}
                                    onChange={handlePostInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                <textarea
                                    name="content"
                                    value={editedPost.content}
                                    onChange={handlePostInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={savePostChanges}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {loading ? (
                                        <span>
                                            Save Changes....
                                        </span>
                                    ) : (
                                        <span>
                                            Save Changes
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Post Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Delete Post</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeletePost}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    {loading ? (
                                        <span>Deleting...</span>
                                    ) : (
                                        <span>Delete</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;