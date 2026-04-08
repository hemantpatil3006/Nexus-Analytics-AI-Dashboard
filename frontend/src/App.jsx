import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import ChatBox from './components/ChatBox';
import Login from './components/Login';
import { LogOut, Activity } from 'lucide-react';

function App() {
  const [csvData, setCsvData] = useState(() => {
    const saved = localStorage.getItem('nexus_csvData');
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'));

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('nexus_csvData');
    setAuthToken(null);
    setCsvData(null);
  };

  if (!authToken) {
    return <Login setAuthToken={setAuthToken} />;
  }

  const handleDataReceived = (data) => {
    setCsvData(data);
    localStorage.setItem('nexus_csvData', JSON.stringify(data));
  };

  const clearData = () => {
    setCsvData(null);
    localStorage.removeItem('nexus_csvData');
  };

  return (
    <div className="min-h-screen mesh-bg-light overflow-x-hidden font-sans pb-6 sm:pb-12 selection:bg-emerald-500/30">
      {/* Premium Header NavBar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-white/5"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-white">Nexus</h1>
            <p className="text-[9px] sm:text-[11px] text-emerald-300/80 font-medium uppercase tracking-widest mt-0.5">Analytic Engine</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="group flex items-center text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all bg-slate-800/50 hover:bg-red-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-700/50 hover:border-red-500/30"
        >
          <LogOut size={16} className="mr-1 sm:mr-2 group-hover:text-red-400 transition-colors" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </motion.header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <AnimatePresence mode="wait">
          {!csvData ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center mt-6 sm:mt-12"
            >
              <div className="text-center mb-8 sm:mb-10 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />
                 <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4 drop-shadow-lg leading-tight">Upload Intelligence</h2>
                 <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto font-light px-4">Initialize the analytic engine by dropping your proprietary dataset below.</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="w-full max-w-3xl glass-panel rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 mb-8 relative overflow-hidden group border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-2xl"
              >
                {/* Animated gradient border effect via before element or absolute div */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <FileUpload onDataReceived={handleDataReceived} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8"
            >
              {/* Left Data Table Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-7 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col h-[500px] lg:h-[calc(100vh-140px)] min-h-[500px] lg:min-h-[600px] shadow-2xl relative overflow-hidden group border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="absolute top-0 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
                <div className="flex justify-between items-end mb-4 sm:mb-6 px-1 sm:px-2 z-10">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Dataset Terminal</h2>
                    <div className="flex items-center mt-1 sm:mt-2 space-x-2">
                       <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
                        </span>
                       <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                        SYNCED: First {csvData.data.length} / {csvData.totalRows} rows
                       </p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearData} 
                    className="flex items-center text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg border border-slate-700 transition-all"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    New Upload
                  </motion.button>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/50 shadow-inner z-10 max-w-full">
                  <DataTable data={csvData.data} columns={csvData.columns} />
                </div>
              </motion.div>

              {/* Right Logic Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-5 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col h-[550px] lg:h-[calc(100vh-140px)] min-h-[550px] lg:min-h-[600px] shadow-2xl relative overflow-hidden group border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="absolute bottom-0 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1 sm:mb-2 flex items-center z-10">
                  Nexus Co-Pilot
                  <span className="ml-2 sm:ml-3 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] uppercase font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">Active</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 font-light z-10">Ask advanced natural language queries about your dataset.</p>
                <div className="flex-1 overflow-hidden relative z-10">
                  <ChatBox csvData={csvData} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
