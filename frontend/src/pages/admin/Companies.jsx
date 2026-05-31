import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import CompanyCard from '../../components/CompanyCard';
import { CardSkeleton } from '../../components/SkeletonLoader';
import { Plus, Search, X, Loader2, Calendar, ClipboardList, Code2, Award, Briefcase, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCompanies = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    package: '',
    minCGPA: '',
    deadline: '',
    description: '',
  });

  const [allowedBranches, setAllowedBranches] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const branchesOptions = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/companies', {
        params: { search: search || undefined }
      });
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      toast('Failed to load companies.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingCompany(null);
    setFormData({
      companyName: '',
      role: '',
      package: '',
      minCGPA: '',
      deadline: '',
      description: '',
    });
    setAllowedBranches([]);
    setRequiredSkills([]);
    setSkillInput('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    
    // Format date to yyyy-MM-dd for HTML date input
    let formattedDate = '';
    if (company.deadline) {
      formattedDate = new Date(company.deadline).toISOString().split('T')[0];
    }

    setFormData({
      companyName: company.companyName || '',
      role: company.role || '',
      package: company.package || '',
      minCGPA: company.minCGPA || '',
      deadline: formattedDate,
      description: company.description || '',
    });
    setAllowedBranches(company.allowedBranches || []);
    setRequiredSkills(company.requiredSkills || []);
    setSkillInput('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBranch = (branch) => {
    setAllowedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !requiredSkills.includes(cleanSkill)) {
      setRequiredSkills((prev) => [...prev, cleanSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setRequiredSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { companyName, role, minCGPA, deadline, description } = formData;
    const salaryPackage = formData.package;

    if (!companyName || !role || !salaryPackage || !minCGPA || !deadline) {
      toast('Please fill in all required form fields.', 'error');
      return;
    }

    if (allowedBranches.length === 0) {
      toast('Please select at least one eligible academic branch.', 'error');
      return;
    }

    const payload = {
      companyName,
      role,
      package: parseFloat(salaryPackage),
      minCGPA: parseFloat(minCGPA),
      allowedBranches,
      requiredSkills,
      deadline,
      description,
    };

    try {
      setFormLoading(true);
      let response;
      if (editingCompany) {
        // Edit API call using PUT /api/companies/:id
        // Wait, the endpoint expects package or packageLPA?
        // Let's check updateCompany in controllers/companyController.js
        // Inside the controller, we replaced packageLPA with package, so package is correct!
        response = await apiClient.put(`/companies/${editingCompany._id}`, payload);
      } else {
        // Create API call using POST /api/companies
        response = await apiClient.post('/companies', payload);
      }

      if (response.data.success) {
        toast(
          editingCompany 
            ? 'Company details updated successfully!' 
            : 'New company created successfully!', 
          'success'
        );
        setIsModalOpen(false);
        fetchCompanies();
      }
    } catch (err) {
      console.error('Error submitting company:', err);
      const message = err.response?.data?.message || 'Failed to submit company details.';
      toast(message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company? This action is irreversible.')) return;

    try {
      const response = await apiClient.delete(`/companies/${companyId}`);
      if (response.data.success) {
        toast('Company deleted successfully.', 'success');
        fetchCompanies();
      }
    } catch (err) {
      console.error('Failed to delete company:', err);
      toast('Failed to delete company.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">Manage Companies</h1>
          <p className="text-gray-400 text-sm mt-1">Post job listings, configure branches/CGPA barriers, and edit details.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCompanies}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 transition-colors w-fit flex items-center space-x-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/10 flex items-center space-x-2 glow-button"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Company</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Filter by company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company._id}>
              <CompanyCard
                company={company}
                isAdmin={true}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteCompany}
              />
            </div>
          ))}

          {companies.length === 0 && (
            <div className="col-span-full glass p-12 rounded-3xl border border-white/5 text-center text-gray-500 space-y-3">
              <Briefcase className="h-10 w-10 text-gray-600 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">No company listings posted</h3>
              <p className="text-xs max-w-sm mx-auto">Create your first campus recruitment posting by clicking the Add Company button.</p>
            </div>
          )}
        </div>
      )}

      {/* sliding modal form (Add/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black z-45"
            />
            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-full max-w-lg glass border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="h-20 border-b border-white/5 flex items-center justify-between px-8">
                <h3 className="text-lg font-bold font-display text-white">
                  {editingCompany ? 'Edit Company Opening' : 'Add New Company Listing'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <input
                      name="companyName"
                      type="text"
                      placeholder="e.g. Google"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Designation / Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <input
                      name="role"
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Salary Package & CGPA */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Package */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Salary (LPA)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Award className="h-5 w-5" />
                      </div>
                      <input
                        name="package"
                        type="number"
                        placeholder="e.g. 24"
                        value={formData.package}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* CGPA */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Min CGPA Barrier</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Award className="h-5 w-5" />
                      </div>
                      <input
                        name="minCGPA"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 8.00"
                        value={formData.minCGPA}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deadline Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <input
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Allowed Branches */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Allowed Branches</label>
                  <div className="flex flex-wrap gap-2">
                    {branchesOptions.map((branch) => (
                      <button
                        type="button"
                        key={branch}
                        onClick={() => toggleBranch(branch)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                          allowedBranches.includes(branch)
                            ? 'bg-purple-600/25 border-purple-500 text-purple-300'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Required Skills tags */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Required Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white/5 text-gray-300 border border-white/5 text-xs font-medium"
                      >
                        <span>{skill}</span>
                        <button type="button" onClick={() => handleRemoveSkill(skill)}>
                          <X className="h-3 w-3 text-gray-500 hover:text-white" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. python"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Enter role description, screening details, and eligibility criteria details..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{editingCompany ? 'Save Changes' : 'Post Listing'}</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCompanies;
