import React from 'react';
import { Link } from 'react-router-dom';

const HomePageLoggedIn = ({ userInfo }) => {
  const quickActions = [
    {
      title: "Repository",
      description: "Access all documents and knowledge assets",
      icon: "📚",
      path: "/repository",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Upload Documents",
      description: "Add new knowledge to the system",
      icon: "📤",
      path: "/upload",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Exams & Tests",
      description: "Take knowledge assessment tests",
      icon: "📝",
      path: "/exams",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "My Profile",
      description: "Manage your account and preferences",
      icon: "👤",
      path: "/profile",
      color: "from-orange-500 to-red-500"
    }
  ];

  const recentActivities = [
    { action: "Viewed", document: "Technical Manual v2.1", time: "2 hours ago" },
    { action: "Uploaded", document: "Project Report Q3", time: "1 day ago" },
    { action: "Completed", document: "Safety Training Exam", time: "2 days ago" },
    { action: "Shared", document: "Meeting Notes", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Header Section */}
      <section className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  {userInfo.username}!
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Ready to continue your knowledge journey? Here's what's happening today.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userInfo.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                <div className="mt-4 flex items-center text-cyan-600 group-hover:text-cyan-700 transition-colors duration-300">
                  <span className="text-sm font-medium">Get Started</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity & Stats Section */}
      <section className="py-12 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className={`p-6 ${index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors duration-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-cyan-600 text-sm font-semibold">
                            {activity.action.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{activity.document}</p>
                          <p className="text-sm text-gray-500">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Overview */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="space-y-4">
                {[
                  { label: "Documents Viewed", value: "24", change: "+12%" },
                  { label: "Exams Completed", value: "8", change: "+5%" },
                  { label: "Uploads This Month", value: "15", change: "+20%" },
                  { label: "Knowledge Score", value: "87%", change: "+3%" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-600 text-sm">{stat.label}</span>
                      <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                tip: "Use advanced search filters to find documents faster",
                icon: "🔍"
              },
              {
                tip: "Bookmark important documents for quick access",
                icon: "📌"
              },
              {
                tip: "Complete regular training to improve your knowledge score",
                icon: "🎯"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-100">
                <div className="text-2xl mb-4">{item.icon}</div>
                <p className="text-gray-700 leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageLoggedIn;