import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, ArrowRight, BrainCircuit } from 'lucide-react';

const Login = ({ setAuthToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      
      {/* Left abstract hero section (Only visible on large screens) */}
      <div className="hidden lg:flex w-1/2 mesh-bg text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/70 z-0"></div>
        <div className="z-10 relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <BrainCircuit className="text-blue-300" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Nexus Analytics</h1>
          </div>
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Turn raw data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">intelligent insights</span> instantly.
          </h2>
          <p className="text-lg text-slate-100 max-w-md font-normal leading-relaxed">
            The next-generation data visualization platform strictly powered by Google GenAI. Upload your datasets and let our AI Analyst draw the charts.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-white">
        
        {/* Subtle background flair for login side */}
        <div className="absolute top-0 right-0 -m-32 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="w-full max-w-md px-8 py-10 z-10">
          <div className="mb-10 lg:hidden text-center">
             <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/30">
               <BrainCircuit size={32} />
             </div>
             <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Nexus Analytics</h1>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isRegistering ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isRegistering ? 'Enter your details to get started.' : 'Please enter your academic credentials.'}
            </p>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50/50 hover:bg-slate-50 text-slate-900"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50/50 hover:bg-slate-50 text-slate-900"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center">
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 font-semibold transition-all"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <button 
                type="button"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
              >
                {isRegistering ? 'Sign in here' : 'Create one now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
