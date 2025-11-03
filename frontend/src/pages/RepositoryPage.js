import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useLocation } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import ExamsSection from '../components/ExamsSection';

const RepositoryPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024);
    const [activeFilters, setActiveFilters] = useState({
        category: [],
        kategori: [],
        departemen: [],
        tipe_dokumen: [],
        status: [],
        tahun: []
    });
    const [activeSection, setActiveSection] = useState('documents');
    const location = useLocation();

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const getUserInfo = () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo && userInfo !== 'undefined' ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Error parsing userInfo:', error);
            return null;
        }
    };

    const userInfo = getUserInfo();

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            console.warn('Categories endpoint not available');
            setCategories([
                { _id: 'technical', name: 'Technical' },
                { _id: 'finance', name: 'Finance' },
                { _id: 'hr', name: 'Human Resources' },
                { _id: 'operations', name: 'Operations' }
            ]);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/documents');
            setDocuments(data);
            setFilteredDocuments(data);
            setError('');
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError('Failed to fetch documents');
            setDocuments([]);
            setFilteredDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = React.useCallback((documentsToFilter, filters = activeFilters) => {
        let filtered = [...documentsToFilter];

        Object.keys(filters).forEach(category => {
            const activeCategoryFilters = filters[category];
            if (activeCategoryFilters?.length > 0) {
                filtered = filtered.filter(doc => {
                    if (!doc || typeof doc !== 'object') return false;
                    
                    switch (category) {
                        case 'category':
                            return doc.category && activeCategoryFilters.includes(doc.category.name);
                        case 'kategori':
                            return doc.type && activeCategoryFilters.includes(doc.type);
                        case 'departemen':
                            return doc.department && activeCategoryFilters.includes(doc.department);
                        case 'tipe_dokumen':
                            const fileExt = doc.filename?.split('.').pop()?.toLowerCase();
                            return activeCategoryFilters.some(filter => {
                                if (filter === 'PDF') return fileExt === 'pdf';
                                if (filter === 'Word Document') return ['doc', 'docx'].includes(fileExt);
                                if (filter === 'Excel Spreadsheet') return ['xls', 'xlsx', 'csv'].includes(fileExt);
                                if (filter === 'PowerPoint Presentation') return ['ppt', 'pptx'].includes(fileExt);
                                if (filter === 'Image Files') return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt);
                                if (filter === 'Video Tutorial') return ['mp4', 'avi', 'mov'].includes(fileExt);
                                return false;
                            });
                        case 'status':
                            return doc.status && activeCategoryFilters.includes(doc.status);
                        case 'tahun':
                            if (!doc.createdAt) return false;
                            try {
                                const docYear = new Date(doc.createdAt).getFullYear().toString();
                                return activeCategoryFilters.includes(docYear);
                            } catch {
                                return false;
                            }
                        default:
                            return true;
                    }
                });
            }
        });

        return filtered;
    }, [activeFilters]);

    useEffect(() => {
        if (location.state?.searchTerm) {
            const searchTerm = location.state.searchTerm.toLowerCase().trim();
            if (searchTerm) {
                const filtered = documents.filter(doc => {
                    if (!doc || typeof doc !== 'object') return false;
                    
                    const matchesTitle = doc.title?.toLowerCase().includes(searchTerm) || false;
                    const matchesDescription = doc.description?.toLowerCase().includes(searchTerm) || false;
                    const matchesUploader = doc.uploader?.username?.toLowerCase().includes(searchTerm) || false;
                    const matchesCategory = doc.category?.name?.toLowerCase().includes(searchTerm) || false;
                    
                    return matchesTitle || matchesDescription || matchesUploader || matchesCategory;
                });
                setFilteredDocuments(filtered);
            } else {
                setFilteredDocuments(documents);
            }
            
            window.history.replaceState({}, document.title);
        }
    }, [location.state, documents]);

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
        const filtered = applyFilters(documents, filters);
        setFilteredDocuments(filtered);
    };

    const removeFilter = (category, filterValue) => {
        const updatedFilters = {
            ...activeFilters,
            [category]: activeFilters[category].filter(item => item !== filterValue)
        };
        setActiveFilters(updatedFilters);
        const filtered = applyFilters(documents, updatedFilters);
        setFilteredDocuments(filtered);
    };

    const clearAllFilters = () => {
        const resetFilters = {
            category: [],
            kategori: [],
            departemen: [],
            tipe_dokumen: [],
            status: [],
            tahun: []
        };
        setActiveFilters(resetFilters);
        setFilteredDocuments(documents);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchCategories();
            await fetchDocuments();
        };
        loadData();
    }, []);

    useEffect(() => {
        if (documents.length > 0) {
            const filtered = applyFilters(documents);
            setFilteredDocuments(filtered);
        }
    }, [documents, applyFilters]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await api.delete(`/documents/${id}`);
                fetchDocuments();
            } catch (err) {
                alert('Failed to delete document');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getFileExtension = (filename) => {
        return filename?.split('.').pop()?.toLowerCase() || '';
    };

    const getFileType = (filename) => {
        const ext = getFileExtension(filename);
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
        const audioTypes = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
        const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
        const spreadsheetTypes = ['xls', 'xlsx', 'csv'];
        const presentationTypes = ['ppt', 'pptx'];

        if (imageTypes.includes(ext)) return 'image';
        if (videoTypes.includes(ext)) return 'video';
        if (audioTypes.includes(ext)) return 'audio';
        if (documentTypes.includes(ext)) return 'document';
        if (spreadsheetTypes.includes(ext)) return 'spreadsheet';
        if (presentationTypes.includes(ext)) return 'presentation';
        return 'other';
    };

    const getFileTypeBadge = (filename) => {
        const fileType = getFileType(filename);
        const ext = getFileExtension(filename);
        
        const typeColors = {
            image: 'bg-green-100 text-green-800',
            video: 'bg-purple-100 text-purple-800',
            audio: 'bg-blue-100 text-blue-800',
            document: 'bg-orange-100 text-orange-800',
            pdf: 'bg-red-100 text-red-800',
            spreadsheet: 'bg-green-100 text-green-800',
            presentation: 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-800'
        };

        const typeNames = {
            image: 'Image',
            video: 'Video',
            audio: 'Audio',
            document: 'Document',
            pdf: 'PDF',
            spreadsheet: 'Spreadsheet',
            presentation: 'Presentation',
            other: 'File'
        };

        const color = typeColors[fileType] || 'bg-gray-100 text-gray-800';
        const name = typeNames[fileType] || 'File';

        return (
            <span className={`${color} text-xs px-2 py-1 rounded-full font-medium`}>
                {name} • {ext.toUpperCase()}
            </span>
        );
    };
    
    const activeFiltersCount = Object.values(activeFilters).reduce((count, filters) => {
        return count + (Array.isArray(filters) ? filters.length : 0);
    }, 0);
 
    if (loading && activeSection === 'documents') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading documents...</p>
                </div>
            </div>
        );
    }
 
    if (error && activeSection === 'documents') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-semibold">{error}</p>
                        <button
                            onClick={fetchDocuments}
                            className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {activeSection === 'documents' ? 'Document Repository' : 'Exams & Assessments'}
                            </h1>
                            <p className="text-gray-600">
                                {activeSection === 'documents' 
                                    ? location.state?.searchTerm 
                                        ? `Search results for "${location.state.searchTerm}" - ${filteredDocuments.length} documents found`
                                        : `Manage and access all your documents in one place - ${filteredDocuments.length} documents total`
                                    : 'Test your knowledge with exams and assessments'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-1 self-start">
                            <button
                                onClick={() => setActiveSection('documents')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                                    activeSection === 'documents'
                                        ? 'bg-cyan-600 text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Documents
                            </button>
                            <button
                                onClick={() => setActiveSection('exams')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                                    activeSection === 'exams'
                                        ? 'bg-cyan-600 text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Exams
                            </button>
                        </div>
                    </div>
                </div>

                {activeSection === 'documents' ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className={`${showFilters ? 'block' : 'hidden'} lg:w-80 flex-shrink-0`}>
                            <FilterSidebar 
                                onFilterChange={handleFilterChange}
                                categories={categories}
                                activeFilters={activeFilters}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                                        {activeFiltersCount > 0 && (
                                            <span className="bg-cyan-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>

                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(activeFilters)
                                        .filter(([category, filters]) => Array.isArray(filters) && filters.length > 0)
                                        .flatMap(([category, filters]) => 
                                            filters
                                                .filter(filter => filter && typeof filter === 'string')
                                                .map((filter, index) => (
                                                    <span 
                                                        key={`${category}-${filter}-${index}`}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                                                    >
                                                        {filter}
                                                        <button 
                                                            onClick={() => removeFilter(category, filter)}
                                                            className="ml-2 hover:text-cyan-900 text-sm"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))
                                        )
                                    }
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDocuments.map((doc) => (
                                    <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col">
                                        <div className="p-6 border-b border-gray-100 flex-grow">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
                                                    <Link 
                                                        to={`/documents/${doc._id}`}
                                                        className="hover:text-cyan-600 transition-colors duration-200"
                                                    >
                                                        {doc.title || 'Untitled Document'}
                                                    </Link>
                                                </h3>
                                                
                                                {userInfo?.role === 'admin' && (
                                                    <button
                                                        onClick={() => deleteHandler(doc._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-lg hover:bg-red-50 flex-shrink-0"
                                                        title="Delete document"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>

                                            {doc.category?.name && (
                                                <span className="inline-block bg-cyan-100 text-cyan-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full mb-3">
                                                    {doc.category.name}
                                                </span>
                                            )}

                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {doc.description || 'No description available'}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Uploaded by {doc.uploader?.username || 'Unknown User'}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50 rounded-b-xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{formatDate(doc.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    {getFileTypeBadge(doc.filename)}
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <Link
                                                    to={`/documents/${doc._id}`}
                                                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 px-4 rounded-lg transition duration-200 font-medium text-sm"
                                                >
                                                    Preview Document
                                                </Link>
                                                <a
                                                    href={`${API_BASE_URL}/documents/download/${doc._id}`}
                                                    download
                                                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-200 font-medium text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredDocuments.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        {location.state?.searchTerm ? 'No documents found' : 'No documents available'}
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        {location.state?.searchTerm 
                                            ? `No documents match "${location.state.searchTerm}". Try different keywords.`
                                            : activeFiltersCount > 0
                                                ? `No documents found with the current filters. Try adjusting your filters.`
                                                : 'No documents have been uploaded yet.'
                                        }
                                    </p>
                                    {(activeFiltersCount > 0 || !location.state?.searchTerm) && (
                                        <div className="mt-4 flex gap-3 justify-center">
                                            {activeFiltersCount > 0 && (
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                                                >
                                                    Clear All Filters
                                                </button>
                                            )}
                                            {userInfo?.role === 'admin' && !location.state?.searchTerm && (
                                                <Link
                                                    to="/upload"
                                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                                                >
                                                    Upload Your First Document
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <ExamsSection />
                )}
            </div>
        </div>
    );
};

export default RepositoryPage;