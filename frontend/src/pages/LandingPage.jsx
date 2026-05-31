import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, ShieldCheck, Zap, LineChart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col text-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 h-20 glass border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">SmartPlace</span>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition-all duration-200 shadow-md shadow-purple-600/10 flex items-center space-x-1.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-gray-100 text-sm font-semibold transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Sparkles className="h-3 w-3" />
            <span>Next-gen Campus Recruitment Hub</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display leading-[1.1] text-gradient py-2">
            Accelerate Your Career.<br />Track Your Success.
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Smart Placement Tracker streamlines university recruitment with AI eligibility analytics, resume cloud sync, and premium dashboards for students and administrators.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 group transition-all duration-200"
              >
                <span>Enter Portal</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 group transition-all duration-200"
                >
                  <span>Student Sign Up</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                >
                  Admin Access
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
        >
          <div className="glass p-6 rounded-2xl text-left border border-white/5">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Automated Eligibility</h3>
            <p className="text-sm text-gray-400">Instantly matches students with job requisites, preventing application spam and saving valuable time for recruiters.</p>
          </div>

          <div className="glass p-6 rounded-2xl text-left border border-white/5">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">AI-Powered Predictions</h3>
            <p className="text-sm text-gray-400">Leverages academic scores, coding ratings, and project logs to forecast placement success rates.</p>
          </div>

          <div className="glass p-6 rounded-2xl text-left border border-white/5">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl w-fit mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">TPO Control Panel</h3>
            <p className="text-sm text-gray-400">Complete panel to edit job listings, track applicant pipelines, update statuses, and email students instantly.</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-500 mt-auto">
        <p>&copy; {new Date().getFullYear()} Smart Placement Tracker. Designed for high performance.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
