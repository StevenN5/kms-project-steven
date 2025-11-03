import React from "react";
import { Link } from "react-router-dom";
import { Warp } from "@paper-design/shaders-react";

// Enhanced features data with KMS focus
const features = [
  {
    title: "Centralized Repository",
    description: "Unified platform for all your documents, research papers, and knowledge assets with intelligent categorization and metadata management.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L7 3L7 10" />
      </svg>
    ),
    path: "/repository",
    buttonText: "Browse Knowledge",
    action: "navigate",
    stats: "10K+ Documents"
  },
  {
    title: "Military-grade Security",
    description: "Advanced encryption, role-based access control, and audit trails to protect your sensitive knowledge assets and intellectual property.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0v4" />
      </svg>
    ),
    path: "/security",
    buttonText: "View Security",
    action: "navigate",
    stats: "256-bit AES"
  },
  {
    title: "AI-Powered Search",
    description: "Semantic search with natural language processing, intelligent filtering, and knowledge discovery across your entire document ecosystem.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10h3l-4 4-4-4h3V6h2v4z" />
      </svg>
    ),
    path: "/search",
    buttonText: "Try AI Search",
    action: "navigate",
    stats: "Smart Results"
  },
  {
    title: "Collaboration Hub",
    description: "Real-time collaboration, version control, and knowledge sharing features to enhance team productivity and innovation.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    path: "/collaboration",
    buttonText: "Start Collaborating",
    action: "navigate",
    stats: "Team Workspace"
  },
  {
    title: "Analytics & Insights",
    description: "Comprehensive analytics dashboard showing knowledge usage patterns, content performance, and organizational intelligence.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    path: "/analytics",
    buttonText: "View Insights",
    action: "navigate",
    stats: "Live Metrics"
  },
  {
    title: "Workflow Automation",
    description: "Automate document workflows, approval processes, and knowledge lifecycle management with customizable automation rules.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    path: "/automation",
    buttonText: "Explore Automation",
    action: "navigate",
    stats: "Smart Workflows"
  }
];

// Enhanced shader configurations for KMS theme
const getShaderConfig = (index) => {
  const configs = [
    { 
      proportion: 0.3, 
      softness: 0.8, 
      distortion: 0.15, 
      swirl: 0.6, 
      swirlIterations: 8, 
      shape: "checks", 
      shapeScale: 0.08, 
      colors: ["hsl(200, 100%, 20%)", "hsl(180, 100%, 40%)", "hsl(160, 90%, 30%)", "hsl(190, 100%, 50%)"]
    },
    { 
      proportion: 0.4, 
      softness: 1.2, 
      distortion: 0.2, 
      swirl: 0.9, 
      swirlIterations: 12, 
      shape: "dots", 
      shapeScale: 0.12, 
      colors: ["hsl(220, 100%, 15%)", "hsl(240, 100%, 35%)", "hsl(260, 90%, 25%)", "hsl(230, 100%, 45%)"]
    },
    { 
      proportion: 0.35, 
      softness: 0.9, 
      distortion: 0.18, 
      swirl: 0.7, 
      swirlIterations: 10, 
      shape: "checks", 
      shapeScale: 0.1, 
      colors: ["hsl(160, 100%, 15%)", "hsl(140, 100%, 35%)", "hsl(120, 90%, 25%)", "hsl(150, 100%, 45%)"]
    },
    { 
      proportion: 0.5, 
      softness: 1.1, 
      distortion: 0.22, 
      swirl: 0.8, 
      swirlIterations: 15, 
      shape: "waves", 
      shapeScale: 0.15, 
      colors: ["hsl(280, 100%, 15%)", "hsl(300, 100%, 35%)", "hsl(320, 90%, 25%)", "hsl(290, 100%, 45%)"]
    },
    { 
      proportion: 0.45, 
      softness: 1.0, 
      distortion: 0.25, 
      swirl: 0.85, 
      swirlIterations: 12, 
      shape: "grid", 
      shapeScale: 0.13, 
      colors: ["hsl(40, 100%, 20%)", "hsl(60, 100%, 40%)", "hsl(30, 90%, 30%)", "hsl(50, 100%, 50%)"]
    },
    { 
      proportion: 0.38, 
      softness: 0.95, 
      distortion: 0.19, 
      swirl: 0.75, 
      swirlIterations: 11, 
      shape: "hexagons", 
      shapeScale: 0.11, 
      colors: ["hsl(0, 100%, 20%)", "hsl(20, 100%, 40%)", "hsl(10, 90%, 30%)", "hsl(15, 100%, 50%)"]
    },
  ];
  return configs[index % configs.length];
};

// Enhanced Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const shaderConfig = getShaderConfig(index);
  
  const handleClick = (e) => {
    if (feature.action === "scroll") {
      e.preventDefault();
      // Simulate scroll to section
      alert(`Scrolling to ${feature.title} section`);
    }
  };

  const CardContent = () => (
    <div className="relative z-10 p-8 rounded-3xl h-full flex flex-col bg-black/90 border border-white/20 backdrop-blur-sm">
      {/* Header with Icon and Stats */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-500">
          {feature.icon}
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
          <span className="text-xs font-semibold text-cyan-300">{feature.stats}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mb-6">
        <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg leading-tight">
          {feature.title}
        </h3>
        <p className="leading-relaxed text-gray-200 font-medium text-sm drop-shadow-md">
          {feature.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
            <span className="text-sm font-semibold mr-3">{feature.buttonText}</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative group h-96 cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-translate-y-3">
      {/* Shader Background with Enhanced Animation */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
        <Warp 
          style={{ height: "100%", width: "100%" }} 
          {...shaderConfig} 
          scale={1} 
          rotation={0} 
          speed={0.3}
          className="transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
        />
      </div>
      
      {/* Enhanced Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-teal-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 -z-10 group-hover:scale-110"></div>
      
      {/* Border Glow */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-500/50 to-teal-500/50 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-5"></div>

      {/* Glassmorphism Overlay dengan Link */}
      {feature.action === "navigate" ? (
        <Link 
          to={feature.path} 
          className="block relative z-10 h-full rounded-2xl"
          onClick={handleClick}
        >
          <CardContent />
        </Link>
      ) : (
        <div 
          className="relative z-10 h-full rounded-2xl cursor-pointer"
          onClick={handleClick}
        >
          <CardContent />
        </div>
      )}
    </div>
  );
};

export default function FeaturesCards() {
  return (
    <section className="py-20 px-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-full px-6 py-3 mb-6 shadow-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-sm font-semibold text-cyan-700">KMS Features</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Intelligent{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Discover the comprehensive features designed to transform how your organization 
            manages, shares, and leverages knowledge assets.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index} 
            />
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="relative bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-12 border border-cyan-100 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 mask-dots"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Revolutionize Your Knowledge Management?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Join forward-thinking organizations that trust our platform to centralize 
                their knowledge assets and drive innovation through intelligent information management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/repository"
                  className="group bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center">
                    Start Exploring
                    <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/demo"
                  className="group bg-white/80 backdrop-blur-sm border border-cyan-200 text-cyan-700 hover:bg-white hover:border-cyan-300 font-semibold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center">
                    Request Demo
                    <svg className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}