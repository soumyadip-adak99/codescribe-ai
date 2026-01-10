import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

function BlogManagement() {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'createdDate', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [editBlog, setEditBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const { getAllBlogsDetails } = useAuth();

    const blogsPerPage = 8;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const blogData = await getAllBlogsDetails();
                if (blogData) {
                    setBlogs(blogData);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [getAllBlogsDetails]);

    // Filter blogs
    // Filter blogs
    const filteredBlogs = blogs.filter(blog => {
        // Safely handle potentially undefined properties
        const id = blog.id || '';
        const title = blog.title || '';
        const authorName = blog.authorName || '';
        const authorEmail = blog.authorEmail || '';

        const matchesSearch =
            id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            blog.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort blogs
    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);

    // Sort request
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        let color = "";
        switch (status) {
            case "PUBLISHED": color = "bg-green-500"; break;
            case "DRAFT": color = "bg-yellow-500"; break;
            case "PENDING_REVIEW": color = "bg-blue-500"; break;
            case "ARCHIVED": color = "bg-gray-500"; break;
            default: color = "bg-purple-500";
        }
        return (
            <span className={`${color} text-white text-xs px-2 py-1 rounded-full`}>
                {status}
            </span>
        );
    };

    // Handle edit save
    const handleSaveEdit = (e) => {
        e.preventDefault();
        setBlogs(blogs.map(blog =>
            blog.id === editBlog.id ? editBlog : blog
        ));
        setEditBlog(null);
    };

    return (
        <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl text-white font-bold">Blog Management</h1>
                <p className="text-gray-400">Manage all blog posts and content</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, title, author or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        className="w-full md:w-48 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PENDING_REVIEW">Pending Review</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
            </div>

            {/* Blogs Table */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-400">Loading blogs...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-750">
                                <tr>
                                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('id')}>
                                        <div className="flex items-center">
                                            Blog ID
                                            {sortConfig.key === 'id' && (
                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('title')}>
                                        <div className="flex items-center">
                                            Title
                                            {sortConfig.key === 'title' && (
                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('authorName')}>
                                        <div className="flex items-center">
                                            Author
                                            {sortConfig.key === 'authorName' && (
                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('status')}>
                                        <div className="flex items-center">
                                            Status
                                            {sortConfig.key === 'status' && (
                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('createdDate')}>
                                        <div className="flex items-center">
                                            Created
                                            {sortConfig.key === 'createdDate' && (
                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {currentBlogs.length > 0 ? (
                                    currentBlogs.map((blog) => (
                                        <tr
                                            key={blog.id}
                                            className="hover:bg-gray-750 cursor-pointer"
                                            onClick={() => setSelectedBlog(blog)}
                                        >
                                            <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-300">
                                                {blog.id.substring(0, 8)}...
                                            </td>
                                            <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium text-white">
                                                {blog.title.substring(0, 30)}{blog.title.length > 30 ? '...' : ''}
                                            </td>
                                            <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-300">
                                                <div>
                                                    <div>{blog.authorName}</div>
                                                    <div className="text-xs text-gray-400">{blog.authorEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                                                <StatusBadge status={blog.status} />
                                            </td>
                                            <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-300">
                                                {new Date(blog.create_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-blue-400 hover:text-blue-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditBlog(blog);
                                                        }}
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-400">
                                            No blogs found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 gap-4">
                        <div className="text-sm text-gray-400">
                            Showing <span className="font-medium">{indexOfFirstBlog + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(indexOfLastBlog, filteredBlogs.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredBlogs.length}</span> blogs
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Blog Detail Modal */}
            {selectedBlog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-white">{selectedBlog.title}</h2>
                                <button
                                    onClick={() => setSelectedBlog(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Blog ID</h3>
                                    <p className="text-white">{selectedBlog.id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                                    <StatusBadge status={selectedBlog.status} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Author</h3>
                                    <p className="text-white">{selectedBlog.authorName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Author Email</h3>
                                    <p className="text-white">{selectedBlog.authorEmail}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Created Date</h3>
                                    <p className="text-white">{new Date(selectedBlog.createdDate).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">AI Approved</h3>
                                    <p className="text-white">{selectedBlog.isAiApproved ? 'Yes' : 'No'}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Content</h3>
                                <div className="bg-gray-700 p-4 rounded-lg text-white">
                                    {selectedBlog.content}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-750 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Views</h3>
                                    <p className="text-2xl font-bold text-white">{selectedBlog.views}</p>
                                </div>
                                <div className="bg-gray-750 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Likes</h3>
                                    <p className="text-2xl font-bold text-white">{selectedBlog.likes}</p>
                                </div>
                                <div className="bg-gray-750 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Comments</h3>
                                    <p className="text-2xl font-bold text-white">{selectedBlog.comments}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Blog Modal */}
            {editBlog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-white">Edit Blog Post</h2>
                                <button
                                    onClick={() => setEditBlog(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editBlog.title}
                                            onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                        <select
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editBlog.status}
                                            onChange={(e) => setEditBlog({ ...editBlog, status: e.target.value })}
                                        >
                                            <option value="PUBLISHED">Published</option>
                                            <option value="DRAFT">Draft</option>
                                            <option value="PENDING_REVIEW">Pending Review</option>
                                            <option value="ARCHIVED">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                    <textarea
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                        value={editBlog.content}
                                        onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditBlog(null)}
                                        className="px-4 py-2 text-gray-300 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogManagement;