import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ limited = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

    // Refs untuk detect klik di luar
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Handle klik di luar dropdown dan search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        navigate('/');
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        window.location.reload();
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Redirect ke login dulu jika belum login
            if (!userInfo) {
                navigate('/login', { state: { from: 'search', searchTerm: searchTerm.trim() } });
            } else {
                navigate('/repository', { state: { searchTerm: searchTerm.trim() } });
            }
            setSearchTerm('');
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Navigation links - SEMUA USER bisa lihat Home dan About
    const publicNavLinks = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/about', label: 'About', icon: 'ℹ️' }
    ];

    // Navigation links tambahan untuk USER YANG SUDAH LOGIN
    const privateNavLinks = [
        { path: '/repository', label: 'Repository', icon: '📚' },
        { path: '/upload', label: 'Upload', icon: '📤' },
        { path: '/exams', label: 'Exams', icon: '📝' },
        ...(userInfo && userInfo.role === 'admin' 
            ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] 
            : [])
    ];

    // Gabungkan links: Public + Private (jika login)
    const navLinks = userInfo 
        ? [...publicNavLinks, ...privateNavLinks]
        : publicNavLinks;

    return (
        <nav className="bg-gradient-to-r from-teal-800 to-cyan-700 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                            onClick={closeMobileMenu}
                        >
                            <span className="text-white">🧠</span>
                            <span>PLNSC KMS</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - SEMUA USER bisa lihat */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => {
                                    // Cek jika fitur butuh login
                                    const requiresLogin = privateNavLinks.some(privateLink => privateLink.path === link.path);
                                    if (requiresLogin && !userInfo) {
                                        e.preventDefault();
                                        navigate('/login', { state: { from: link.path } });
                                    } else {
                                        closeMobileMenu();
                                    }
                                }}
                                className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                                    isActiveRoute(link.path)
                                        ? 'bg-white/20 text-white shadow-md'
                                        : 'text-cyan-100 hover:bg-white/10 hover:text-white'
                                } ${!userInfo && privateNavLinks.some(privateLink => privateLink.path === link.path) ? 'opacity-80 hover:opacity-100' : ''}`}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                                {!userInfo && privateNavLinks.some(privateLink => privateLink.path === link.path) && (
                                    <span className="text-xs bg-yellow-500 text-white px-1 rounded">Login</span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Search & User Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search Button & Bar */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => {
                                    if (!userInfo) {
                                        navigate('/login', { state: { from: 'search' } });
                                    } else {
                                        setIsSearchOpen(!isSearchOpen);
                                    }
                                }}
                                className="flex items-center space-x-2 p-2 rounded-lg text-cyan-100 hover:bg-white/10 hover:text-white transition duration-200"
                                title={userInfo ? "Search documents" : "Login to search"}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-sm">Search</span>
                                {!userInfo && <span className="text-xs bg-yellow-500 text-white px-1 rounded">Login</span>}
                            </button>

                            {/* Search Bar Dropdown - Hanya tampil jika user login */}
                            {isSearchOpen && userInfo && (
                                <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl p-4 min-w-80 border border-gray-200">
                                    <form onSubmit={handleSearch} className="flex space-x-2">
                                        <div className="relative flex-1">
                                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search documents, exams, users..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                                                autoFocus
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
                                        >
                                            Go
                                        </button>
                                    </form>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Press Enter to search
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Section dengan Dropdown */}
                        {userInfo ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition duration-200 border border-white/10"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow-sm">
                                        {userInfo.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-sm">Hi, {userInfo.username}</div>
                                        <div className="text-xs text-cyan-200 capitalize">{userInfo.role}</div>
                                    </div>
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="font-medium text-gray-900">{userInfo.username}</div>
                                            <div className="text-sm text-gray-500 capitalize">{userInfo.role}</div>
                                        </div>
                                        
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-cyan-50 transition duration-200 group"
                                        >
                                            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-cyan-200 transition duration-200">
                                                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-medium">My Profile</div>
                                                <div className="text-xs text-gray-500">Manage your account</div>
                                            </div>
                                        </Link>

                                        <div className="border-t border-gray-100 my-1"></div>
                                        
                                        <button
                                            onClick={logoutHandler}
                                            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition duration-200 group"
                                        >
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-red-200 transition duration-200">
                                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-medium">Logout</div>
                                                <div className="text-xs text-red-500">Sign out from system</div>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/register"
                                    className="text-cyan-100 hover:text-white font-medium py-2 px-4 transition duration-200"
                                >
                                    Register
                                </Link>
                                <Link 
                                    to="/login"
                                    className="bg-white text-cyan-700 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700 shadow-sm"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Mobile Search Button */}
                        <button
                            onClick={() => {
                                if (!userInfo) {
                                    navigate('/login', { state: { from: 'search' } });
                                } else {
                                    setIsSearchOpen(!isSearchOpen);
                                }
                            }}
                            className={`p-2 rounded-lg transition duration-200 ${
                                isSearchOpen ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 text-cyan-100'
                            }`}
                            title={userInfo ? "Search documents" : "Login to search"}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className={`p-2 rounded-lg transition duration-200 ${
                                isMobileMenuOpen ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 text-cyan-100'
                            }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar - Hanya tampil jika user login */}
                {isSearchOpen && userInfo && (
                    <div className="md:hidden py-4 border-t border-white/20 bg-cyan-750">
                        <form onSubmit={handleSearch} className="flex space-x-2">
                            <div className="relative flex-1">
                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search documents, exams, users..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg transition duration-200 font-medium"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div 
                        ref={mobileMenuRef}
                        className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-teal-800 to-cyan-700 shadow-xl z-40 border-t border-white/20"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {/* Navigation Links */}
                            {navLinks.map((link) => {
                                const requiresLogin = privateNavLinks.some(privateLink => privateLink.path === link.path);
                                
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={(e) => {
                                            if (requiresLogin && !userInfo) {
                                                e.preventDefault();
                                                navigate('/login', { state: { from: link.path } });
                                            }
                                            closeMobileMenu();
                                        }}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                                            isActiveRoute(link.path)
                                                ? 'bg-white/20 text-white'
                                                : 'text-cyan-100 hover:bg-white/10'
                                        } ${!userInfo && requiresLogin ? 'opacity-80 hover:opacity-100' : ''}`}
                                    >
                                        <span className="text-lg">{link.icon}</span>
                                        <span className="flex-1">{link.label}</span>
                                        {!userInfo && requiresLogin && (
                                            <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Login</span>
                                        )}
                                    </Link>
                                );
                            })}
                            
                            {/* User Section Mobile */}
                            {userInfo ? (
                                <div className="pt-4 border-t border-white/20 mt-2">
                                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-lg mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center font-semibold text-white">
                                            {userInfo.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{userInfo.username}</div>
                                            <div className="text-sm text-cyan-200 capitalize">{userInfo.role}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Profile Submenu */}
                                    <div className="space-y-2">
                                        <Link
                                            to="/profile"
                                            onClick={closeMobileMenu}
                                            className="flex items-center space-x-3 px-4 py-3 text-cyan-100 hover:bg-white/10 rounded-lg transition duration-200"
                                        >
                                            <span>👤</span>
                                            <span>My Profile</span>
                                        </Link>
                                        <button 
                                            onClick={logoutHandler}
                                            className="flex items-center space-x-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition duration-200"
                                        >
                                            <span>🚪</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-white/20 mt-2 space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center space-x-2 bg-white text-cyan-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
                                    >
                                        <span>🔐</span>
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center space-x-2 text-cyan-100 hover:bg-white/10 py-3 px-4 rounded-lg transition duration-200 border border-white/20"
                                    >
                                        <span>📝</span>
                                        <span>Register</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay for mobile menu when open */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}
        </nav>
    );
};

export default Navbar;