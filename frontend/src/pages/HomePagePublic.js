import React from 'react';
import { Link } from 'react-router-dom';
import FeaturesCards from '../components/FeaturesCards';

const HomePagePublic = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-full px-4 py-2 mb-8 shadow-lg">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-cyan-700">PLNSC Knowledge Management System</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="block">Smart</span>
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Transform your document management with our intelligent{' '}
            <span className="font-semibold text-cyan-700">Knowledge Management System</span>. 
            Centralize, secure, and access your knowledge effortlessly.
          </p>

          {/* CTA Buttons - HAPUS TOMBOL LOGIN DI SINI */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/login">
              <button className="group relative bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="flex items-center justify-center relative z-10">
                  Get Started →
                </span>
              </button>
            </Link>
            
            <Link to="/about">
              <button className="group bg-white/80 backdrop-blur-sm border border-cyan-200 text-cyan-700 hover:bg-white hover:border-cyan-300 font-semibold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                <span className="flex items-center justify-center">
                  Learn More
                </span>
              </button>
            </Link>
          </div>

          {/* Search Bar & Stats Section */}
          <div className="max-w-2xl mx-auto mb-12">
            {/* Search Bar Placeholder */}
            <div className="relative mb-8">
              <div className="w-full px-6 py-4 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm text-gray-500">
                Search...
              </div>
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                923
              </div>
            </div>
            
            {/* Date */}
            <div className="text-center text-gray-500 font-medium">
              03/11/2025
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { number: '10K+', label: 'Documents' },
              { number: '99.9%', label: 'Uptime' },
              { number: '256-bit', label: 'Encryption' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan-700 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <FeaturesCards />
        </div>
      </section>
    </div>
  );
};

export default HomePagePublic;