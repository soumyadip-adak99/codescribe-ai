import React, { useState, useEffect } from 'react';
import {
    RiChat3Line,
    RiShareForwardLine,
    RiBookmarkLine,
    RiBookmarkFill,
    RiVerifiedBadgeFill,
    RiMoreFill,
    RiHeartLine,
    RiHeartFill
} from 'react-icons/ri';
import { useAuth } from "../../../context/AuthContext.jsx";

function UserHome() {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [randomizedBlogs, setRandomizedBlogs] = useState([]);

    const { allBlogs, fetchAllBlogs, user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await fetchAllBlogs();
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    useEffect(() => {
        if (allBlogs.length > 0) {
            const shuffled = [...allBlogs].sort(() => Math.random() - 0.5);
            setRandomizedBlogs(shuffled);
        }
    }, [allBlogs]);

    const formatDateTime = (dateString) => {
        if (!dateString) return "Unknown date/time";
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleLike = (postId) => {
        setLikedPosts(prev => {
            const newLiked = new Set(prev);
            if (newLiked.has(postId)) {
                newLiked.delete(postId);
            } else {
                newLiked.add(postId);
            }
            return newLiked;
        });
    };

    const handleBookmark = (postId) => {
        setBookmarkedPosts(prev => {
            const newBookmarked = new Set(prev);
            if (newBookmarked.has(postId)) {
                newBookmarked.delete(postId);
            } else {
                newBookmarked.add(postId);
            }
            return newBookmarked;
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PUBLISHED':
            case 'APPROVED':
                return (
                    <span
                        className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/30">
                        <RiVerifiedBadgeFill className="w-3 h-3" /> Published
                    </span>
                );
            case 'DRAFT':
                return (
                    <span
                        className="bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-1 rounded-full border border-amber-500/30">
                        Draft
                    </span>
                );
            case 'PENDING_APPROVAL':
                return (
                    <span
                        className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2 py-1 rounded-full border border-blue-500/30">
                        Pending
                    </span>
                );
            default:
                return null;
        }
    };

    const renderAuthorImage = (post) => {
        if (post.authorProfileImage?.url) {
            return (
                <img
                    src={post.authorProfileImage.url}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-600"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40';
                    }}
                />
            );
        }
        return (
            <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                {post.authorName?.[0] || 'U'}
            </div>
        );
    };

    const renderPostImage = (post) => {
        if (post.image?.url) {
            return (
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
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
                <div className="animate-pulse text-lg">Loading posts...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {randomizedBlogs.length > 0 ? (
                        randomizedBlogs.map((post) => (
                            <div
                                key={post.id}
                                className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl mx-auto"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {renderAuthorImage(post)}
                                            <div>
                                                <p className="text-sm md:text-1xl text-white">{post.authorName || 'Unknown Author'}</p>
                                                <p className="text-xs text-gray-400">{formatDateTime(post.create_at)}</p>
                                            </div>
                                        </div>
                                        {/* {getStatusBadge(post.status)} */}
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">
                                        {post.content}
                                    </p>

                                    {renderPostImage(post)}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                                aria-label="Like post"
                                            >
                                                {likedPosts.has(post.id) ? (
                                                    <RiHeartFill className="w-5 h-5 text-red-400" />
                                                ) : (
                                                    <RiHeartLine className="w-5 h-5" />
                                                )}
                                                <span className="text-sm">
                                                    {formatNumber((post.likes || 0) + (likedPosts.has(post.id) ? 1 : 0))}
                                                </span>
                                            </button>
                                            <button
                                                className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                                                aria-label="Comment on post"
                                            >
                                                <RiChat3Line className="w-5 h-5" />
                                                <span className="text-sm">{formatNumber(post.comments || 0)}</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors"
                                                aria-label="Share post"
                                            >
                                                <RiShareForwardLine className="w-5 h-5" />
                                                <span className="text-sm">{formatNumber(post.shares || 0)}</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleBookmark(post.id)}
                                            className="text-gray-400 hover:text-yellow-400 transition-colors"
                                            aria-label={bookmarkedPosts.has(post.id) ? "Remove bookmark" : "Bookmark post"}
                                        >
                                            {bookmarkedPosts.has(post.id) ? (
                                                <RiBookmarkFill className="w-5 h-5 text-yellow-400" />
                                            ) : (
                                                <RiBookmarkLine className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center max-w-4xl mx-auto"
                        >
                            <div className="text-gray-400 text-lg mb-2">No posts found</div>
                            <p className="text-gray-500 text-sm">Be the first to create a post!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserHome;