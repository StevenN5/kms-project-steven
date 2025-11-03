import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const DocumentDetailPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('preview');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // User info utility
    const getUserInfo = useCallback(() => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo && userInfo !== 'undefined' ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Error parsing userInfo:', error);
            return null;
        }
    }, []);

    const userInfo = getUserInfo();

    // Data fetching functions
    const fetchDocument = useCallback(async () => {
        try {
            const { data } = await api.get(`/documents/${id}`);
            setDocument(data);
        } catch (err) {
            console.error('Error fetching document:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchComments = useCallback(async () => {
        try {
            const { data } = await api.get(`/comments/document/${id}`);
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    }, [id]);

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            await fetchDocument();
            await fetchComments();
        };
        loadData();
    }, [fetchDocument, fetchComments]);

    // Reset preview state when tab changes
    useEffect(() => {
        if (activeTab === 'preview') {
            setPreviewLoading(true);
            setPreviewError('');
        }
    }, [activeTab]);

    // File type utilities
    const getFileExtension = useCallback((filename) => {
        return filename?.split('.').pop()?.toLowerCase() || '';
    }, []);

    const getFileType = useCallback((filename) => {
        const ext = getFileExtension(filename);
        const typeMap = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
            video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
            audio: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
            document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
            spreadsheet: ['xls', 'xlsx', 'csv'],
            presentation: ['ppt', 'pptx']
        };

        for (const [type, extensions] of Object.entries(typeMap)) {
            if (extensions.includes(ext)) return type;
        }
        return 'other';
    }, [getFileExtension]);

    // Preview rendering
    const renderPreview = useCallback(() => {
        if (!document) return null;

        const fileType = getFileType(document.filename);
        const previewUrl = `${API_BASE_URL}/documents/preview/${document._id}`;
        const downloadUrl = `${API_BASE_URL}/documents/download/${document._id}`;
        const ext = getFileExtension(document.filename);

        const previewableTypes = ['pdf', 'image', 'video', 'audio', 'document', 'spreadsheet', 'presentation'];

        if (!previewableTypes.includes(fileType)) {
            return (
                <UnsupportedPreview 
                    extension={ext}
                    downloadUrl={downloadUrl}
                />
            );
        }

        const previewComponents = {
            image: () => (
                <ImagePreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    alt={document.title || 'Document preview'}
                    extension={ext}
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            ),
            pdf: () => (
                <PdfPreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    title={document.title || 'PDF Document'}
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            ),
            video: () => (
                <VideoPreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    extension={ext}
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            ),
            audio: () => (
                <AudioPreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    extension={ext}
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            ),
            document: () => (
                <OfficePreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    title={document.title || 'Office Document'}
                    fileType="document"
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            ),
            spreadsheet: () => (
                <OfficePreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    title={document.title || 'Office Document'}
                    fileType="spreadsheet"
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            ),
            presentation: () => (
                <OfficePreview
                    previewUrl={previewUrl}
                    downloadUrl={downloadUrl}
                    title={document.title || 'Office Document'}
                    fileType="presentation"
                    previewLoading={previewLoading}
                    previewError={previewError}
                    setPreviewLoading={setPreviewLoading}
                    setPreviewError={setPreviewError}
                />
            )
        };

        const PreviewComponent = previewComponents[fileType] || (() => (
            <UnsupportedPreview 
                extension={ext}
                downloadUrl={downloadUrl}
            />
        ));

        return <PreviewComponent />;
    }, [document, getFileType, getFileExtension, API_BASE_URL, previewLoading, previewError]);

    // Comment handlers
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommentLoading(true);
        try {
            const { data } = await api.post('/comments', {
                documentId: id,
                content: newComment
            });
            setComments(prev => [...prev, data]);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Failed to post comment');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/comments/${commentId}`);
                setComments(prev => prev.filter(comment => comment._id !== commentId));
            } catch (err) {
                console.error('Error deleting comment:', err);
                alert('Failed to delete comment');
            }
        }
    };

    // Utility functions
    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'Unknown date';
        
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }, []);

    const getFileTypeBadge = useCallback((filename) => {
        const fileType = getFileType(filename);
        const ext = getFileExtension(filename);
        
        const typeConfig = {
            image: { color: 'from-green-500 to-emerald-500', name: 'Image' },
            video: { color: 'from-purple-500 to-pink-500', name: 'Video' },
            audio: { color: 'from-blue-500 to-cyan-500', name: 'Audio' },
            document: { color: 'from-orange-500 to-red-500', name: 'Document' },
            pdf: { color: 'from-red-500 to-pink-500', name: 'PDF' },
            spreadsheet: { color: 'from-green-500 to-teal-500', name: 'Spreadsheet' },
            presentation: { color: 'from-yellow-500 to-orange-500', name: 'Presentation' },
            other: { color: 'from-gray-500 to-gray-700', name: 'File' }
        };

        const config = typeConfig[fileType] || typeConfig.other;

        return (
            <span className={`bg-gradient-to-r ${config.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                {config.name} • {ext.toUpperCase()}
            </span>
        );
    }, [getFileType, getFileExtension]);

    // Loading state
    if (loading) {
        return <LoadingSpinner message="Loading document..." />;
    }

    // Document not found state
    if (!document) {
        return <NotFoundState />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Document Header */}
                <DocumentHeader 
                    document={document}
                    formatDate={formatDate}
                    getFileTypeBadge={getFileTypeBadge}
                    API_BASE_URL={API_BASE_URL}
                />

                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                    <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} commentsCount={comments.length} />
                    
                    <div className="p-6">
                        {activeTab === 'preview' && (
                            <PreviewContent 
                                previewLoading={previewLoading}
                                previewError={previewError}
                                renderPreview={renderPreview}
                            />
                        )}

                        {activeTab === 'comments' && (
                            <CommentsSection
                                userInfo={userInfo}
                                comments={comments}
                                newComment={newComment}
                                setNewComment={setNewComment}
                                commentLoading={commentLoading}
                                handleCommentSubmit={handleCommentSubmit}
                                handleDeleteComment={handleDeleteComment}
                                formatDate={formatDate}
                            />
                        )}

                        {activeTab === 'details' && (
                            <DocumentDetails 
                                document={document}
                                formatDate={formatDate}
                                getFileExtension={getFileExtension}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components for better organization
const LoadingSpinner = ({ message }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    </div>
);

const NotFoundState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-semibold">Document not found</p>
                <Link to="/repository" className="text-cyan-600 hover:text-cyan-700 mt-2 inline-block">
                    Back to Repository
                </Link>
            </div>
        </div>
    </div>
);

const DocumentHeader = ({ document, formatDate, getFileTypeBadge, API_BASE_URL }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{document.title || 'Untitled Document'}</h1>
                        <p className="text-gray-600">{document.description || 'No description available'}</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Uploaded by <strong>{document.uploader?.username || 'Unknown User'}</strong></span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(document.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                        {getFileTypeBadge(document.filename)}
                    </div>
                </div>
            </div>
            
            <div className="flex space-x-3">
                <a
                    href={`${API_BASE_URL}/documents/download/${document._id}`}
                    download
                    className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                </a>
            </div>
        </div>
    </div>
);

const TabNavigation = ({ activeTab, setActiveTab, commentsCount }) => (
    <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
            {['preview', 'comments', 'details'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                            ? 'border-cyan-500 text-cyan-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {tab === 'comments' ? `Comments (${commentsCount})` : tab}
                </button>
            ))}
        </nav>
    </div>
);

const PreviewContent = ({ previewLoading, previewError, renderPreview }) => (
    <div>
        {previewLoading && !previewError && (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading preview...</p>
            </div>
        )}
        {renderPreview()}
    </div>
);

// Preview Components
const UnsupportedPreview = ({ extension, downloadUrl }) => (
    <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 mb-2">Preview not available for this file type</p>
            <p className="text-sm text-gray-500 mb-4">
                {extension.toUpperCase()} file • Direct download recommended
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
                href={downloadUrl}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download File
            </a>
        </div>
    </div>
);

const ImagePreview = ({ previewUrl, downloadUrl, alt, extension, previewLoading, previewError, setPreviewLoading, setPreviewError }) => (
    <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
            {previewLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
            )}
            <img 
                src={previewUrl}
                alt={alt}
                className={`max-w-full max-h-96 mx-auto rounded-lg shadow-sm ${previewLoading ? 'hidden' : 'block'}`}
                onLoad={() => {
                    setPreviewLoading(false);
                    setPreviewError('');
                }}
                onError={() => {
                    setPreviewLoading(false);
                    setPreviewError('Failed to load image preview');
                }}
            />
        </div>
        {previewError && <p className="text-red-500 text-sm mb-4">{previewError}</p>}
        <p className="text-sm text-gray-500 mb-4">Image preview • {extension.toUpperCase()} file</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Image in New Tab
            </a>
            <a href={downloadUrl} download className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
            </a>
        </div>
    </div>
);

const PdfPreview = ({ previewUrl, downloadUrl, title, previewLoading, previewError, setPreviewLoading, setPreviewError }) => (
    <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-4 mb-4" style={{ height: '600px' }}>
            {previewLoading && (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                    <span className="ml-2 text-gray-600">Loading PDF...</span>
                </div>
            )}
            <iframe
                src={previewUrl}
                className={`w-full h-full border-0 rounded-lg ${previewLoading ? 'hidden' : 'block'}`}
                title={title}
                onLoad={() => {
                    setPreviewLoading(false);
                    setPreviewError('');
                }}
                onError={() => {
                    setPreviewLoading(false);
                    setPreviewError('Failed to load PDF preview');
                }}
            />
        </div>
        {previewError && <p className="text-red-500 text-sm mb-4">{previewError}</p>}
        <p className="text-sm text-gray-500 mb-4">PDF preview • Embedded viewer</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open PDF in New Tab
            </a>
            <a href={downloadUrl} download className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
            </a>
        </div>
    </div>
);

const VideoPreview = ({ previewUrl, downloadUrl, extension, previewLoading, previewError, setPreviewLoading, setPreviewError }) => (
    <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
            {previewLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
            )}
            <video 
                controls 
                className={`max-w-full max-h-96 mx-auto rounded-lg ${previewLoading ? 'hidden' : 'block'}`}
                onLoadStart={() => {
                    setPreviewLoading(false);
                    setPreviewError('');
                }}
                onError={() => {
                    setPreviewLoading(false);
                    setPreviewError('Failed to load video preview');
                }}
            >
                <source src={previewUrl} type={`video/${extension}`} />
                Your browser does not support the video tag.
            </video>
        </div>
        {previewError && <p className="text-red-500 text-sm mb-4">{previewError}</p>}
        <p className="text-sm text-gray-500 mb-4">Video preview • {extension.toUpperCase()} file</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Video in New Tab
            </a>
            <a href={downloadUrl} download className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Video
            </a>
        </div>
    </div>
);

const AudioPreview = ({ previewUrl, downloadUrl, extension, previewLoading, previewError, setPreviewLoading, setPreviewError }) => (
    <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-8 mb-4">
            {previewLoading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
            )}
            <audio 
                controls 
                className={`w-full max-w-md mx-auto ${previewLoading ? 'hidden' : 'block'}`}
                onLoadStart={() => {
                    setPreviewLoading(false);
                    setPreviewError('');
                }}
                onError={() => {
                    setPreviewLoading(false);
                    setPreviewError('Failed to load audio preview');
                }}
            >
                <source src={previewUrl} type={`audio/${extension}`} />
                Your browser does not support the audio tag.
            </audio>
        </div>
        {previewError && <p className="text-red-500 text-sm mb-4">{previewError}</p>}
        <p className="text-sm text-gray-500 mb-4">Audio preview • {extension.toUpperCase()} file</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Audio in New Tab
            </a>
            <a href={downloadUrl} download className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Audio
            </a>
        </div>
    </div>
);

const OfficePreview = ({ previewUrl, downloadUrl, title, fileType, previewLoading, previewError, setPreviewLoading, setPreviewError }) => (
    <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-4 mb-4" style={{ height: '600px' }}>
            {previewLoading && (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                    <span className="ml-2 text-gray-600">Loading document preview...</span>
                </div>
            )}
            <iframe
                src={previewUrl}
                className={`w-full h-full border-0 rounded-lg ${previewLoading ? 'hidden' : 'block'}`}
                title={title}
                onLoad={() => {
                    setPreviewLoading(false);
                    setPreviewError('');
                }}
                onError={() => {
                    setPreviewLoading(false);
                    setPreviewError('Failed to load document preview');
                }}
            />
        </div>
        {previewError && <p className="text-red-500 text-sm mb-4">{previewError}</p>}
        <p className="text-sm text-gray-500 mb-4">Office document preview • Powered by Microsoft Office Online</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in New Tab
            </a>
            <a href={downloadUrl} download className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Original
            </a>
        </div>
    </div>
);

const CommentsSection = ({
    userInfo,
    comments,
    newComment,
    setNewComment,
    commentLoading,
    handleCommentSubmit,
    handleDeleteComment,
    formatDate
}) => (
    <div>
        {userInfo ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {userInfo.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-vertical"
                            required
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-500">
                                {newComment.length}/500 characters
                            </span>
                            <button
                                type="submit"
                                disabled={commentLoading || !newComment.trim()}
                                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                            >
                                {commentLoading ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        ) : (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-cyan-800">
                    Please <Link to="/login" className="font-semibold hover:underline">login</Link> to add comments
                </p>
            </div>
        )}

        <div className="space-y-6">
            {comments.length === 0 ? (
                <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                comments.map((comment) => (
                    <CommentItem 
                        key={comment._id}
                        comment={comment}
                        userInfo={userInfo}
                        handleDeleteComment={handleDeleteComment}
                        formatDate={formatDate}
                    />
                ))
            )}
        </div>
    </div>
);

const CommentItem = ({ comment, userInfo, handleDeleteComment, formatDate }) => (
    <div className="flex space-x-4 group">
        <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
        </div>
        <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">{comment.author?.username || 'Unknown User'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    {(userInfo?.role === 'admin' || userInfo?._id === comment.author?._id) && (
                        <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity duration-200 p-1 rounded"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-gray-700">{comment.content}</p>
            </div>
        </div>
    </div>
);

const DocumentDetails = ({ document, formatDate, getFileExtension }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Information</h3>
            <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-800">{document.title || 'Untitled Document'}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-800">{document.description || 'No description available'}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">File Name</label>
                <p className="text-gray-800">{document.filename}</p>
            </div>
        </div>
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Details</h3>
            <div>
                <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                <p className="text-gray-800">{document.uploader?.username || 'Unknown User'}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">Upload Date</label>
                <p className="text-gray-800">{formatDate(document.createdAt)}</p>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">File Type</label>
                <p className="text-gray-800">{getFileExtension(document.filename).toUpperCase()} File</p>
            </div>
        </div>
    </div>
);

export default DocumentDetailPage;