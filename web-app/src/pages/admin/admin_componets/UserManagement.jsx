import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'create_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const usersPerPage = 8;

    const { getAllUserDetails } = useAuth();

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

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === 'all' ||
            user.role.includes(roleFilter);

        const matchesStatus =
            statusFilter === 'all' ||
            user.userStatus === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

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
            case "ACTIVE": color = "bg-green-500"; break;
            case "PENDING": color = "bg-yellow-500"; break;
            case "BLOCKED": color = "bg-red-500"; break;
            case "INACTIVE": color = "bg-gray-500"; break;
            default: color = "bg-blue-500";
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
        setUsers(users.map(user =>
            user.id === editUser.id ? editUser : user
        ));
        setEditUser(null);
    };

    // Handle delete user
    const handleDeleteUser = async (userId) => {
        try {
            // Here you would typically call an API to delete the user
            setUsers(users.filter(user => user.id !== userId));
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl text-white font-bold">User Management</h1>
                <p className="text-gray-400">Manage all registered users</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, name or email..."
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
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Roles</option>
                        <option value="ROLE_USER">User</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                    </select>
                    <select
                        className="w-full md:w-48 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="BLOCKED">Blocked</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-400">Loading users...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-750">
                                    <tr>
                                        <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('id')}>
                                            <div className="flex items-center">
                                                User ID
                                                {sortConfig.key === 'id' && (
                                                    sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('firstname')}>
                                            <div className="flex items-center">
                                                Name
                                                {sortConfig.key === 'firstname' && (
                                                    sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('email')}>
                                            <div className="flex items-center">
                                                Email
                                                {sortConfig.key === 'email' && (
                                                    sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('userStatus')}>
                                            <div className="flex items-center">
                                                Status
                                                {sortConfig.key === 'userStatus' && (
                                                    sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('create_at')}>
                                            <div className="flex items-center">
                                                Joined
                                                {sortConfig.key === 'create_at' && (
                                                    sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-750 cursor-pointer"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-300">
                                                    {user.id.substring(0, 8)}...
                                                </td>
                                                <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {user.profileImage && (
                                                            <img className="w-8 h-8 rounded-full mr-3" src={user.profileImage} alt={`${user.firstname} ${user.lastname}`} />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{user.firstname} {user.lastname}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                                                    <StatusBadge status={user.userStatus} />
                                                </td>
                                                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-300">
                                                    {/* {console.log(users)} */}
                                                    {user.create_at ? new Date(user.create_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="text-blue-400 hover:text-blue-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditUser(user);
                                                            }}
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            className="text-red-400 hover:text-red-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteUser(user.id);
                                                            }}
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
                                                No users found matching your criteria
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 gap-4">
                                <div className="text-sm text-gray-400">
                                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastUser, filteredUsers.length)}
                                    </span>{' '}
                                    of <span className="font-medium">{filteredUsers.length}</span> users
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
                    </>
                )}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    {selectedUser.profileImage && (
                                        <img className="w-12 h-12 rounded-full mr-4" src={selectedUser.profileImage} alt={`${selectedUser.firstname} ${selectedUser.lastname}`} />
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedUser.firstname} {selectedUser.lastname}</h2>
                                        <p className="text-gray-400">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">User ID</h3>
                                    <p className="text-white">{selectedUser.id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                                    <StatusBadge status={selectedUser.userStatus} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Phone Number</h3>
                                    <p className="text-white">{selectedUser.phoneNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Roles</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.role?.map(role => (
                                            <span key={role} className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Joined Date</h3>
                                    <p className="text-white">{selectedUser.create_at ? new Date(selectedUser.create_at).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-1">Blog Posts</h3>
                                    <p className="text-white">{selectedUser.Blog_data?.length || 0}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Blog Posts</h3>
                                {selectedUser.Blog_data?.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedUser.Blog_data.slice(0, 3).map(blog => (
                                            <div key={blog.id} className="bg-gray-750 p-3 rounded-lg">
                                                <h4 className="font-medium text-white">{blog.title}</h4>
                                                <p className="text-sm text-gray-300 mt-1">{blog.content?.substring(0, 100)}...</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No blog posts yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-white">Edit User</h2>
                                <button
                                    onClick={() => setEditUser(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editUser.firstname || ''}
                                            onChange={(e) => setEditUser({ ...editUser, firstname: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editUser.lastname || ''}
                                            onChange={(e) => setEditUser({ ...editUser, lastname: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editUser.email || ''}
                                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editUser.phoneNumber || ''}
                                            onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                        <select
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editUser.userStatus || 'ACTIVE'}
                                            onChange={(e) => setEditUser({ ...editUser, userStatus: e.target.value })}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="BLOCKED">Blocked</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Roles</label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].map(role => (
                                                <label key={role} className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox bg-gray-700 border-gray-600 rounded text-blue-500"
                                                        checked={editUser.role?.includes(role) || false}
                                                        onChange={(e) => {
                                                            const newRoles = e.target.checked
                                                                ? [...(editUser.role || []), role]
                                                                : (editUser.role || []).filter(r => r !== role);
                                                            setEditUser({ ...editUser, role: newRoles });
                                                        }}
                                                    />
                                                    <span className="ml-2 text-white text-sm">{role}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditUser(null)}
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

export default UserManagement;