import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiMoreVertical, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editBlog, setEditBlog] = useState(null);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [userSortDesc, setUserSortDesc] = useState(true);
    const [blogSortDesc, setBlogSortDesc] = useState(true);
    const [confirmWindowUser, setconfirmWindowUser] = useState(false)
    const [confirmWindowUserBlog, setconfirmWindowBlog] = useState(false)
    const [currentId, setCurrentId] = useState('')
    const [loading, setLoading] = useState(true);

    const { getAllUserDetails, getAllBlogsDetails, userDelete, blogDelete } = useAuth();

    // Fetch user details when component ,mounts
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const userData = await getAllUserDetails();
                if (userData) {
                    setUsers(userData);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [getAllUserDetails]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true)
                const blogData = await getAllBlogsDetails()
                if (blogData) {
                    setBlogs(blogData)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlogs()
    }, [getAllBlogsDetails])

    // Sort users by creation date (using create_at or fallback to current date)
    const sortedUsers = [...users].sort((a, b) => {
        const dateA = new Date(a.create_at || new Date());
        const dateB = new Date(b.create_at || new Date());
        return userSortDesc ? dateB - dateA : dateA - dateB;
    });

    // Sort blogs by creation date
    const sortedBlogs = [...blogs].sort((a, b) => {
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        return blogSortDesc ? dateB - dateA : dateA - dateB;
    });

    // Get only the first 4 users/blogs
    const displayedUsers = sortedUsers.slice(0, 4);
    const displayedBlogs = sortedBlogs.slice(0, 4);

    // Handle delete
    const handleDeleteUser = (id) => {
        setconfirmWindowUser(true)
        setCurrentId(id)
    };

    const hadleConfirmDeleteUser = async () => {
        try {
            setLoading(true)
            await userDelete(currentId)
            const id = currentId
            setBlogs(users.filter(users => users.id !== id));
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete user")
        } finally {
            setconfirmWindowUser(false)
            setCurrentId('')
            setLoading(false)
        }
    }

    const handleDeleteBlog = (id) => {
        setconfirmWindowBlog(true)
        setCurrentId(id)
        //setBlogs(blogs.filter(blog => blog.id !== id));
    };

    const handleConfirmDeleteBlog = async () => {
        try {
            setLoading(true)
            await blogDelete(currentId)
            const id = currentId
            setBlogs(blogs.filter(blog => blog.id !== id));
        } catch (err) {
            console.log(err)
            toast.error('Faild to delete blog')
        } finally {
            setconfirmWindowBlog(false)
            setCurrentId('')
            setLoading(false)
        }
    }

    // Handle edit
    const handleEditUser = (user) => {
        setEditUser(user);
        setShowUserForm(true);
    };

    const handleEditBlog = (blog) => {
        setEditBlog(blog);
        setShowBlogForm(true);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        let color = "";
        switch (status) {
            case "ACTIVE": color = "bg-green-500"; break;
            case "PENDING": color = "bg-yellow-500"; break;
            case "ARCHIVED": color = "bg-gray-500"; break;
            case "PUBLISHED":
            case "APPROVED": color = "bg-blue-500"; break;
            case "DRAFT": color = "bg-purple-500"; break;
            default: color = "bg-gray-500";
        }
        return (
            <span className={`${color} text-white text-xs px-2 py-1 rounded-full`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl text-white font-bold">Admin Dashboard</h1>
                <p className="text-gray-400">Overview and management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Total Blogs</h3>
                    <p className="text-3xl font-bold text-white">{blogs.length}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-white">
                        {users.filter(u => u.userStatus === "ACTIVE").length}
                    </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Published Blogs</h3>
                    <p className="text-3xl font-bold text-white">
                        {blogs.filter(b => b.status === "APPROVED").length}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Users</h2>
                    <button
                        onClick={() => setUserSortDesc(!userSortDesc)}
                        className="flex items-center text-gray-400 hover:text-white"
                    >
                        Sort by Date {userSortDesc ? <FiChevronDown /> : <FiChevronUp />}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SL No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {displayedUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {user.firstname} {user.lastname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={user.userStatus} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {/* {console.log(user?.create_at)} */}
                                        {user.create_at ? new Date(user.create_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiTrash2 />
                                            </button>
                                            <button className="text-gray-400 hover:text-white">
                                                <FiMoreVertical />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Blogs Table */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Blogs</h2>
                    <button
                        onClick={() => setBlogSortDesc(!blogSortDesc)}
                        className="flex items-center text-gray-400 hover:text-white"
                    >
                        Sort by Date {blogSortDesc ? <FiChevronDown /> : <FiChevronUp />}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SL No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Blog ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">AI Approved</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {displayedBlogs.map((blog, index) => (

                                <tr key={blog.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{blog.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{blog.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{blog.authorName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {blog.isAiApproved ? "Yes" : "No"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={blog.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {/* {console.log(blog)} */}
                                        {new Date(blog.create_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditBlog(blog)}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBlog(blog.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiTrash2 />
                                            </button>
                                            <button className="text-gray-400 hover:text-white">
                                                <FiMoreVertical />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showUserForm && editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">First Name</label>
                                <input
                                    type="text"
                                    defaultValue={editUser.firstname}
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                                <input
                                    type="text"
                                    defaultValue={editUser.lastname}
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue={editUser.email}
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUserForm(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Blog Modal */}
            {showBlogForm && editBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Blog</h3>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Title</label>
                                <input
                                    type="text"
                                    defaultValue={editBlog.title}
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Content</label>
                                <textarea
                                    defaultValue={editBlog.content}
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2 h-32"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Status</label>
                                <select
                                    defaultValue={editBlog.status}
                                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                                >
                                    <option value="APPROVED">Approved</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="PENDING_REVIEW">Pending Review</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowBlogForm(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* delete modal */}
            {confirmWindowUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white mb-2">Confirm Deletion</h3>
                            <p className="text-gray-300 mb-6">
                                Are your soure you want to delete
                            </p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setconfirmWindowUser(false)}
                                disabled={loading}
                                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={hadleConfirmDeleteUser}
                                disabled={loading}
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmWindowUserBlog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white mb-2">Confirm Deletion</h3>
                            <p className="text-gray-300 mb-6">
                                Are your soure you want to delete
                            </p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setconfirmWindowBlog(false)}
                                disabled={loading}
                                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDeleteBlog}
                                disabled={loading}
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard; 