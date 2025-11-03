import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Document Repository",
            description: "View and download documents with an intuitive interface"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            title: "User and Admin Roles",
            description: "Different access levels for regular users and administrators"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Admin Management",
            description: "Admins can add and delete documents from the repository"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
            title: "Comment System",
            description: "Users and admins can comment on documents for collaboration"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Secure Authentication",
            description: "JWT-based authentication for secure access"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: "Advanced Search",
            description: "Find documents quickly with powerful search functionality"
        }
    ];

    const techStack = [
        { name: "MongoDB", description: "NoSQL database for flexible data storage" },
        { name: "Express.js", description: "Web application framework for Node.js" },
        { name: "React.js", description: "Frontend library for building user interfaces" },
        { name: "Node.js", description: "JavaScript runtime for server-side development" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework for styling" },
        { name: "JWT", description: "JSON Web Tokens for secure authentication" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About This System</h1>
                        <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
                            A modern Knowledge Management System built with the MERN stack to streamline 
                            document management and enhance team collaboration.
                        </p>
                    </div>
                </div>
            </section>

{/* Security Section */}
<section className="py-16 bg-white" id="security">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Security & Access Control</h2>
            <p className="text-gray-600 text-lg">Robust security measures to protect your sensitive data</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center text-white mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Role-Based Access Control</h3>
                <p className="text-gray-600">
                    Different access levels for administrators and regular users ensure that sensitive documents are only accessible to authorized personnel.
                </p>
            </div>
            
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Secure Authentication</h3>
                <p className="text-gray-600">
                    JWT-based authentication system with encrypted tokens and secure session management for maximum security.
                </p>
            </div>
        </div>
    </div>
</section>
            {/* Features Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
                        <p className="text-gray-600 text-lg">Everything you need for effective knowledge management</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Technology Stack</h2>
                        <p className="text-gray-600 text-lg">Built with modern technologies for optimal performance</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {techStack.map((tech, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{tech.name}</h3>
                                <p className="text-gray-600 text-sm">{tech.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-cyan-50 to-teal-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Join the platform and start managing your knowledge effectively today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/repository"
                            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Explore Repository
                        </Link>
                        {!localStorage.getItem('userInfo') && (
                            <Link
                                to="/login"
                                className="bg-white text-cyan-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 border border-cyan-200 shadow-sm"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;