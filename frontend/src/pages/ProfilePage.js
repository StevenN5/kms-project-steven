import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // <-- PERUBAHAN 1: Ganti axios ke api

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // userInfo tidak perlu state

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                // Interceptor akan otomatis menambahkan header Authorization
                
                // --- PERUBAHAN 2: Ganti 'axios.get' dan hapus '/api' ---
                const { data } = await api.get('/users/profile'); 
                
                setUser(data);
                setFormData({
                    username: data.username,
                    email: data.email,
                    name: data.name || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Gagal memuat profil. ' + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, userInfo]); // Dependensi userInfo sudah cukup

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Interceptor akan otomatis menambahkan header
            
            // --- PERUBAHAN 3: Ganti 'axios.put' dan hapus '/api' ---
            const { data } = await api.put('/users/profile', formData);

            // Update user di state dan local storage
            setUser(data.user);
            const updatedUserInfo = { ...userInfo, ...data.user };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setSuccess('Profil berhasil diperbarui!');
            setIsEditing(false);
            
            window.location.reload();

        } catch (err) {
            setError('Gagal memperbarui profil. ' + (err.response?.data?.message || err.message));
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Password baru tidak cocok!');
            return;
        }

        try {
            const payload = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            };
            
            // --- PERUBAHAN 4: Ganti 'axios.put' dan hapus '/api' ---
            await api.put('/users/change-password', payload);
            
            setPasswordSuccess('Password berhasil diubah!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

        } catch (err) {
            setPasswordError('Gagal mengubah password. ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading profil...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Akun Saya</h1>

                {/* --- KARTU PROFIL --- */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-5">
                                <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {/* --- PERUBAHAN 5: Perbaikan minor jika user null di awal --- */}
                                    {user?.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{user?.name || user?.username}</h2>
                                    <p className="text-gray-600">{user?.email}</p>
                                    <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition"
                            >
                                {isEditing ? 'Batal' : 'Edit Profil'}
                            </button>
                        </div>

                        {/* --- FORM EDIT PROFIL --- */}
                        {isEditing && (
                            <form onSubmit={handleProfileUpdate} className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Informasi</h3>
                                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                                {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
                                
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            value={formData.username}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition"
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* --- KARTU GANTI PASSWORD --- */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
                    <form onSubmit={handlePasswordSubmit} className="p-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ubah Password</h3>
                        {passwordError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{passwordError}</div>}
                        {passwordSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{passwordSuccess}</div>}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Password Saat Ini</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    id="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Password Baru</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition"
                                >
                                    Ubah Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;