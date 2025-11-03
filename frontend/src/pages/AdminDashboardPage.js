import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const StatisticsTab = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-500">Total Documents</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">{stats.documents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-500">Total Categories</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">{stats.categories}</p>
        </div>
    </div>
);

// --- PERUBAHAN: Menambahkan props adminId, onDelete, onToggleStatus ---
const UsersTab = ({ users, adminId, onDelete, onToggleStatus }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    {/* --- TAMBAHAN: Kolom Status & Actions --- */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {(users || []).map(user => (
                    // --- PERUBAHAN: Tambahkan style jika tidak aktif ---
                    <tr 
                        key={user._id}
                        className={!user.isActive ? 'bg-gray-50 opacity-50' : ''}
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {/* --- PERUBAHAN: Tambahkan coretan & label (You) --- */}
                            <span className={!user.isActive ? 'line-through' : ''}>{user.username}</span>
                            {user._id === adminId && <span className="text-xs text-cyan-600 font-bold ml-2">(You)</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={!user.isActive ? 'line-through' : ''}>{user.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                        
                        {/* --- TAMBAHAN: Kolom Status --- */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.isActive ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Inactive
                                </span>
                            )}
                        </td>
                        {/* --- TAMBAHAN: Kolom Actions --- */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            {user._id !== adminId ? (
                                <>
                                    <button 
                                        onClick={() => onToggleStatus(user._id)}
                                        className={`font-semibold ${user.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} transition duration-200`}
                                    >
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button 
                                        onClick={() => onDelete(user._id)}
                                        className="text-red-600 hover:text-red-800 font-semibold transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-400 text-xs italic">No actions</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const CategoriesTab = ({ categories, onAdd, onDelete, newCategoryName, setNewCategoryName }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <form onSubmit={onAdd} className="space-y-4">
                <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input 
                        type="text" 
                        id="categoryName" 
                        value={newCategoryName} 
                        onChange={(e) => setNewCategoryName(e.target.value)} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" 
                        placeholder="e.g., Keuangan" 
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition duration-200"
                >
                    Add Category
                </button>
            </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
            <ul className="divide-y divide-gray-200">
                {(categories || []).map(cat => (
                    <li key={cat._id} className="py-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                        <button 
                            onClick={() => onDelete(cat._id)} 
                            className="text-sm font-medium text-red-500 hover:text-red-700 transition duration-200"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const UploadTab = ({ categories, onUploadSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!title.trim()) {
                const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
                setTitle(fileNameWithoutExt);
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!file || !categoryId) {
            setMessage('Please select a category and a file.');
            return;
        }
        
        setIsUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('document', file);
        formData.append('categoryId', categoryId);

        try {
            await api.post('/documents/upload', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            });
            
            setMessage('File uploaded successfully!');
            setTitle('');
            setDescription('');
            setFile(null);
            setCategoryId('');
            setFileInputKey(Date.now());
            
            onUploadSuccess();
        } catch (error) {
            console.error('Upload error:', error);
            setMessage(error.response?.data?.message || 'File upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload New Document</h2>
                
                {message && ( 
                    <div className={`mb-6 p-4 rounded-lg text-center ${
                        message.includes('successfully') 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                        {message}
                    </div> 
                )}
                
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Document Title *</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200" 
                            placeholder="Enter document title" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea 
                            rows="4" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 resize-vertical" 
                            placeholder="Enter document description (optional)"
                        ></textarea>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                        <select 
                            value={categoryId} 
                            onChange={(e) => setCategoryId(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 bg-white"
                        >
                            <option value="">-- Select a Category --</option>
                            {(categories || []).map(cat => ( 
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Select File *</label>
                        <input 
                            key={fileInputKey}
                            type="file" 
                            onChange={handleFileChange} 
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.mp4,.avi,.mov,.wmv,.flv,.webm,.mp3,.wav,.ogg,.m4a,.flac,.txt" 
                            required 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition duration-200" 
                        />
                        {file && (
                            <p className="text-sm text-gray-500 mt-2">
                                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isUploading || !file || !categoryId} 
                        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                            </div>
                        ) : (
                            'Upload Document'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState({ users: 0, documents: 0, categories: 0 });
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    
    // --- TAMBAHAN: State untuk menyimpan ID admin ---
    const [adminId, setAdminId] =useState(null);

    const fetchData = useCallback(async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || userInfo.role !== 'admin') { 
                navigate('/login'); 
                return; 
            }
            
            // --- TAMBAHAN: Simpan ID admin ---
            setAdminId(userInfo._id);

            setLoading(true);
            const [usersRes, docsRes, catsRes] = await Promise.all([
                api.get('/users'),
                api.get('/documents'),
                api.get('/categories')
            ]);
            
            setUsers(usersRes.data);
            setCategories(catsRes.data);
            setStats({ 
                users: usersRes.data.length, 
                documents: docsRes.data.length, 
                categories: catsRes.data.length 
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { 
        fetchData(); 
    }, [fetchData]);
    
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await api.post('/categories', { name: newCategoryName });
            setNewCategoryName('');
            fetchData();
        } catch (error) {
            console.error('Error adding category:', error);
            alert(error.response?.data?.message || 'Failed to add category. It might already exist.');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure? This action cannot be undone.')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert(error.response?.data?.message || 'Failed to delete category.');
            }
        }
    };

    // --- TAMBAHAN: Fungsi untuk hapus user ---
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchData(); // Muat ulang data setelah berhasil
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    // --- TAMBAHAN: Fungsi untuk toggle status user ---
    const handleToggleStatus = async (userId) => {
        // Cek status user saat ini untuk pesan konfirmasi
        const action = users.find(u => u._id === userId)?.isActive ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await api.put(`/users/${userId}/toggle-status`);
                fetchData(); // Muat ulang data setelah berhasil
            } catch (error) {
                console.error('Error toggling user status:', error);
                alert(error.response?.data?.message || 'Failed to change user status.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
                
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {['stats', 'users', 'categories', 'upload'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)} 
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                                    activeTab === tab 
                                        ? 'border-cyan-500 text-cyan-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab === 'stats' && 'Statistics'}
                                {tab === 'users' && 'Manage Users'}
                                {tab === 'categories' && 'Manage Categories'}
                                {tab === 'upload' && 'Upload Document'}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    {activeTab === 'stats' && <StatisticsTab stats={stats} />}
                    
                    {/* --- PERUBAHAN: Kirim props baru ke UsersTab --- */}
                    {activeTab === 'users' && (
                        <UsersTab 
                            users={users}
                            adminId={adminId}
                            onDelete={handleDeleteUser}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}
                    
                    {activeTab === 'categories' && (
                        <CategoriesTab 
                            categories={categories} 
                            onAdd={handleAddCategory} 
                            onDelete={handleDeleteCategory} 
                            newCategoryName={newCategoryName} 
                            setNewCategoryName={setNewCategoryName} 
                        />
                    )}
                    {activeTab === 'upload' && (
                        <UploadTab 
                            categories={categories} 
                            onUploadSuccess={fetchData} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;