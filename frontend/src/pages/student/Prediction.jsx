import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BrainCircuit, Loader2, Compass, ShieldAlert, Sparkles, Award, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentPrediction = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    cgpa: '',
    projects: '2',
    leetcodeSolved: '120',
    internships: '0',
    backlogs: '0',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        cgpa: user.cgpa || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = (e) => {
    e.preventDefault();
    const { cgpa, projects, leetcodeSolved, internships, backlogs } = formData;

    if (!cgpa) {
      toast('Please verify your CGPA before running prediction.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    // Mock an AI loading sequence
    setTimeout(() => {
      // Calculate a mock score based on actual metrics
      const cgpaScore = parseFloat(cgpa) * 10; // Max 100
      const projectScore = Math.min(parseInt(projects) * 15, 30); // Max 30
      const codeScore = Math.min(parseInt(leetcodeSolved) * 0.15, 45); // Max 45
      const internScore = Math.min(parseInt(internships) * 20, 20); // Max 20
      const backlogPenalty = parseInt(backlogs) * 25; // Negative impact

      let finalScore = (cgpaScore * 0.45) + projectScore + codeScore + internScore - backlogPenalty;
      finalScore = Math.max(10, Math.min(99, Math.round(finalScore)));

      // Set breakdown metrics
      const breakdown = {
        probability: finalScore,
        cgpaContrib: Math.min(100, Math.round(parseFloat(cgpa) * 10)),
        projectContrib: Math.round((projectScore / 30) * 100),
        codeContrib: Math.round((codeScore / 45) * 100),
      };

      setResult(breakdown);
      setLoading(false);
      toast('AI Prediction compiled successfully!', 'success');
    }, 2000);
  };

  const getFeedback = (prob) => {
    if (prob >= 85) {
      return {
        title: 'Outstanding Profile Alignment',
        text: 'Your academic scores, coding platform presence, and experience place you in the top tier. You are highly likely to secure an offer in the early rounds. Continue practicing system design and behavior rounds.',
        icon: Rocket,
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
      };
    }
    if (prob >= 65) {
      return {
        title: 'Strong Technical Candidate',
        text: 'You have a healthy technical profile. To push your placement probability above 90%, focus on building one major production-grade project, polishing your resume structure, and conducting mock interviews.',
        icon: Sparkles,
        color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
      };
    }
    return {
      title: 'Actionable Improvement Required',
      text: 'Our models suggest your profile needs reinforcement. We recommend eliminating any backlogs, raising your LeetCode problem count to 150+, and completing at least 2 full-stack projects to list on your resume.',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5'
    };
  };

  const feedback = result ? getFeedback(result.probability) : null;

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">AI Placement Predictor</h1>
        <p className="text-gray-400 text-sm mt-1">Leverages university model datasets to forecast hiring success probability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Predictor inputs */}
        <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden h-fit">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-500" />
          
          <h2 className="text-xl font-bold font-display text-white mb-6">Profile Parameters</h2>

          <form onSubmit={handlePredict} className="space-y-5">
            {/* CGPA */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Academic CGPA</label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
                required
              />
            </div>

            {/* Projects Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Number of Projects</label>
              <select
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-medium appearance-none"
              >
                <option value="0" className="bg-zinc-950">0 Projects</option>
                <option value="1" className="bg-zinc-950">1 Project</option>
                <option value="2" className="bg-zinc-950">2 Projects</option>
                <option value="3" className="bg-zinc-950">3+ Projects</option>
              </select>
            </div>

            {/* LeetCode Problems */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">LeetCode Solved Problems</label>
              <input
                name="leetcodeSolved"
                type="number"
                min="0"
                value={formData.leetcodeSolved}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
              />
            </div>

            {/* Internships */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Internships</label>
              <select
                name="internships"
                value={formData.internships}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm font-medium appearance-none"
              >
                <option value="0" className="bg-zinc-950">0 Internships</option>
                <option value="1" className="bg-zinc-950">1 Internship</option>
                <option value="2" className="bg-zinc-950">2+ Internships</option>
              </select>
            </div>

            {/* Backlogs */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Backlogs</label>
              <input
                name="backlogs"
                type="number"
                min="0"
                value={formData.backlogs}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 text-sm font-medium"
              />
            </div>

            {/* Predict Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-600/25 mt-2 flex items-center justify-center space-x-2 glow-button"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Calculating models...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" />
                  <span>Run Placement Predictor</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dashboard Display Area */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-10 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center flex-1 h-full min-h-[400px]"
              >
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white font-display mb-2">Analyzing Data Streams</h3>
                <p className="text-sm text-gray-400 max-w-xs">Comparing profile indicators against historic batch selection benchmarks...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex-1 flex flex-col h-full"
              >
                {/* Score Panel */}
                <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8">
                  {/* Radial Dial Indicator */}
                  <div className="relative h-44 w-44 flex items-center justify-center flex-shrink-0">
                    <svg className="absolute transform -rotate-90 w-full h-full">
                      <circle
                        cx="88"
                        cy="88"
                        r="75"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="14"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="88"
                        cy="88"
                        r="75"
                        stroke="url(#purpleGradient)"
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 75}
                        initial={{ strokeDashoffset: 2 * Math.PI * 75 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 75 * (1 - result.probability / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center z-10">
                      <span className="text-4xl font-extrabold font-display bg-gradient-to-tr from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {result.probability}%
                      </span>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Probability</p>
                    </div>
                  </div>

                  {/* Feedback Summary */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-xl font-bold font-display text-white">AI Profile Evaluation</h3>
                    <div className={`p-4 rounded-2xl border text-sm ${feedback.color} flex items-start space-x-3`}>
                      <feedback.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-white mb-1">{feedback.title}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{feedback.text}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Contributions */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 flex-1">
                  <h4 className="text-base font-bold font-display text-white">Evaluation Breakdown</h4>
                  
                  <div className="space-y-4">
                    {/* CGPA Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-semibold">Academic Score Standing</span>
                        <span className="text-white font-bold">{result.cgpaContrib}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${result.cgpaContrib}%` }} />
                      </div>
                    </div>

                    {/* Code Standing */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-semibold">Competitive Coding Level</span>
                        <span className="text-white font-bold">{result.codeContrib}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${result.codeContrib}%` }} />
                      </div>
                    </div>

                    {/* Project standing */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-semibold">Projects Endorsement Weight</span>
                        <span className="text-white font-bold">{result.projectContrib}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full rounded-full" style={{ width: `${result.projectContrib}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-10 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center flex-1 h-full min-h-[400px] text-gray-500 space-y-3"
              >
                <Compass className="h-12 w-12 text-gray-600 mx-auto" />
                <h3 className="text-lg font-bold text-white font-display">Predictions Uncompiled</h3>
                <p className="text-sm max-w-xs mx-auto">Fill in your academic standing, projects, and interview ratings on the left, then click Run to compile forecasts.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default StudentPrediction;
