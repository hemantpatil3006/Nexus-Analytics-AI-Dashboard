import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ setAuthToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiBase}${endpoint}`, formData);
      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0b0c10] font-sans selection:bg-emerald-500/30 overflow-hidden">
      
      {/* Left abstract hero section (Only visible on large screens) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-[55%] mesh-bg text-white flex-col justify-center px-10 xl:px-20 relative"
      >
        <div className="absolute inset-0 bg-slate-900/40 z-0"></div>
        {/* Animated Orbs */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-600/30 rounded-full blur-[100px] z-0" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-600/20 rounded-full blur-[120px] z-0" 
        />

        <div className="z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-3 xl:space-x-4 mb-6 xl:mb-8"
          >
            <div className="p-3 xl:p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <BrainCircuit className="text-emerald-400 w-6 h-6 xl:w-8 xl:h-8" />
            </div>
            <div>
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white">Nexus</h1>
              <p className="text-xs xl:text-sm font-medium text-emerald-300 tracking-[0.2em] uppercase mt-1">Analytics</p>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-6 xl:mb-8"
          >
            Turn raw data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-sm">intelligent insights</span> instantly.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg xl:text-xl text-slate-400 max-w-lg font-light leading-relaxed"
          >
            The next-generation data visualization platform powered by Generative AI. Upload your datasets and let our AI Analyst draw the charts.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Login Section */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[45%] flex items-center justify-center relative bg-[#0b0c10] border-l border-white/5 z-20 shadow-2xl px-4 sm:px-0"
      >
        {/* Subtle background flair for login side */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-900/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-[420px] px-4 sm:px-8 py-8 sm:py-10 z-10 glass-panel lg:border-none lg:bg-transparent lg:shadow-none rounded-3xl lg:rounded-none">
          <div className="mb-10 lg:hidden text-center">
             <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-3 sm:mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
               <BrainCircuit className="w-6 h-6 sm:w-8 sm:h-8" />
             </div>
             <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Nexus Analytics</h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center lg:justify-start">
              {isRegistering ? 'Initialize Setup' : 'Welcome Back'}
              {isRegistering && <Sparkles className="ml-2 sm:ml-3 text-emerald-400 w-5 h-5 sm:w-6 sm:h-6" />}
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-400 font-light">
              {isRegistering ? 'Enter your details to create your secure workspace.' : 'Please enter your academic or corporate credentials.'}
            </p>
          </motion.div>
          
          <form className="mt-8 sm:mt-10 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-5">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-white text-sm sm:text-base placeholder-slate-600 shadow-inner"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-white text-sm sm:text-base placeholder-slate-600 shadow-inner"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </motion.div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 text-red-400 text-xs sm:text-sm p-3.5 sm:p-4 rounded-xl border border-red-500/20 flex items-center"
              >
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="group w-full flex justify-center items-center py-3 sm:py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(5,150,105,0.2)] hover:shadow-[0_0_25px_rgba(5,150,105,0.4)] text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 font-semibold text-sm sm:text-base transition-all disabled:opacity-70 border border-emerald-400/20"
            >
              {isSubmitting ? 'Authenticating...' : (isRegistering ? 'Initialize Workspace' : 'Access Terminal')}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 sm:mt-8 text-center"
          >
            <p className="text-xs sm:text-sm text-slate-400">
              {isRegistering ? 'Already have access? ' : "Need to initialize a workspace? "}
              <button 
                type="button"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors hover:underline underline-offset-4"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
              >
                {isRegistering ? 'Sign in here' : 'Register now'}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
