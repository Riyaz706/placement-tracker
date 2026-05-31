import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Award, BookOpen, Code2, CloudUpload, Eye, FileText, Loader2, X, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentProfile = () => {
  const { user, updateProfile, uploadResume } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    cgpa: '',
    gitHubProfile: '',
    leetCodeProfile: '',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        branch: user.branch || 'CSE',
        cgpa: user.cgpa || '',
        gitHubProfile: user.gitHubProfile || '',
        leetCodeProfile: user.leetCodeProfile || '',
      });
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !skills.includes(cleanSkill)) {
      setSkills((prev) => [...prev, cleanSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast('Name is required.', 'error');
      return;
    }
    if (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10) {
      toast('CGPA must be between 0 and 10.', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      name: formData.name,
      branch: formData.branch,
      cgpa: parseFloat(formData.cgpa),
      skills,
    };
    
    const result = await updateProfile(payload);
    setSaving(false);

    if (result.success) {
      toast('Profile updated successfully!', 'success');
    } else {
      toast(result.message || 'Failed to update profile.', 'error');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast('Please upload a PDF file only.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast('File size exceeds the 2MB limit.', 'error');
      return;
    }

    setUploading(true);
    const result = await uploadResume(file);
    setUploading(false);

    if (result.success) {
      toast('Resume uploaded successfully!', 'success');
    } else {
      toast(result.message || 'Resume upload failed.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">My Workstation Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your credentials, skill endorsements, and resume documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-500" />
            
            <h2 className="text-xl font-bold font-display text-white mb-6">Profile Details</h2>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-white/3 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Branch */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Academic Branch</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <select
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

                {/* CGPA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current CGPA</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Award className="h-5 w-5" />
                    </div>
                    <input
                      name="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Tag input */}
              <div className="space-y-2 border-t border-white/5 pt-6">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Core Endorsement Skills</label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-purple-400/60 hover:text-purple-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No skills listed. Add some below.</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Type a skill (e.g. React) and click Add"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/25 transition-all text-sm font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Profile */}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-purple-600/20 flex items-center space-x-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Resume Management Sidebar */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-500" />
            
            <h2 className="text-xl font-bold font-display text-white mb-4">Resume Document</h2>
            <p className="text-xs text-gray-400 mb-6">Upload a PDF copy of your professional curriculum vitae (max 2MB).</p>

            {/* Resume Upload Box */}
            <div className="space-y-5">
              <label 
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  uploading 
                    ? 'border-purple-500/40 bg-purple-500/5 pointer-events-none' 
                    : 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5'
                }`}
              >
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {uploading ? (
                  <div className="space-y-2">
                    <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-purple-400">Uploading to Cloudinary...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload className="h-8 w-8 text-gray-500 mx-auto" />
                    <p className="text-sm font-bold text-white">Click to upload file</p>
                    <p className="text-[10px] text-gray-500 font-medium">PDF formats only</p>
                  </div>
                )}
              </label>

              {/* Uploaded Resume Status */}
              {user?.resume ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <FileText className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">resume.pdf</p>
                      <p className="text-[10px] text-gray-500 font-medium">Cloud Hosted</p>
                    </div>
                  </div>
                  <a 
                    href={user.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex-shrink-0"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center">
                  <p className="text-xs font-semibold text-rose-400">No resume uploaded. Upload a resume to enable job applications.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
