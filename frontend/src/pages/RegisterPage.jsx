import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, Award, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const { register, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // 'student' or 'admin'
    branch: 'CSE',
    cgpa: '',
  });

  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role, branch, cgpa } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email.toLowerCase())) {
      toast('Please enter a valid @gmail.com address.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error');
      return;
    }

    if (role === 'student' && (!branch || !cgpa)) {
      toast('Please enter your branch and CGPA.', 'error');
      return;
    }

    if (role === 'student' && (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10 || isNaN(parseFloat(cgpa)))) {
      toast('CGPA must be a valid number between 0 and 10.', 'error');
      return;
    }

    const payload = {
      name,
      email,
      password,
      confirmPassword,
      role,
      ...(role === 'student' ? { branch, cgpa: parseFloat(cgpa) } : {}),
    };

    setLoading(true);
    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      toast('Account registered successfully! Please log in.', 'success');
      navigate('/login');
    } else {
      toast(result.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center p-6 text-white pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2.5 mb-3">
            <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-display">SmartPlace</span>
          </Link>
          <p className="text-gray-400 text-sm font-medium text-center">Create your workstation account to start tracking</p>
        </div>

        {/* Register Box */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-500" />
          
          <h2 className="text-2xl font-bold font-display text-white mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Register As</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    formData.role === 'student'
                      ? 'bg-purple-600/25 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    formData.role === 'admin'
                      ? 'bg-purple-600/25 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  TPO / Administrator
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            <AnimatePresence>
              {formData.role === 'student' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  {/* Branch Select */}
                  <div className="space-y-1.5">
                    <label htmlFor="branch" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium appearance-none"
                      >
                        <option value="CSE" className="bg-zinc-950">CSE</option>
                        <option value="IT" className="bg-zinc-950">IT</option>
                        <option value="ECE" className="bg-zinc-950">ECE</option>
                        <option value="EEE" className="bg-zinc-950">EEE</option>
                        <option value="MECH" className="bg-zinc-950">MECH</option>
                        <option value="CIVIL" className="bg-zinc-950">CIVIL</option>
                      </select>
                    </div>
                  </div>

                  {/* CGPA Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="cgpa" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CGPA</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Award className="h-5 w-5" />
                      </div>
                      <input
                        id="cgpa"
                        name="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="8.50"
                        value={formData.cgpa}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-600/25 mt-4 flex items-center justify-center space-x-2 glow-button"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Spacer */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
