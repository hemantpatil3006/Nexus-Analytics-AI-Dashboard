import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import ChatBox from './components/ChatBox';
import Login from './components/Login';
import { LogOut } from 'lucide-react';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('jwtToken'));

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(null);
    setCsvData(null);
  };

  if (!authToken) {
    return <Login setAuthToken={setAuthToken} />;
  }

  const handleDataReceived = (data) => {
    setCsvData(data);
  };

  return (
    <div className="min-h-screen mesh-bg-light overflow-hidden font-sans pb-12">
      {/* Premium Header NavBar */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10v3a2 2 0 0 0 2 2h3m15-5v3a2 2 0 0 1-2 2h-3M2 14v-3m15 5v-3"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Nexus</h1>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Analytics Workspace</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center text-sm font-semibold text-slate-600 hover:text-red-500 transition-colors bg-white/50 hover:bg-red-50 px-4 py-2 rounded-full border border-slate-200"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </button>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!csvData ? (
          <div className="flex flex-col items-center justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-8">
               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Upload your Intelligence</h2>
               <p className="text-lg text-slate-500 max-w-xl mx-auto">Initialize the analytic engine by dropping your proprietary dataset below.</p>
            </div>
            <div className="w-full max-w-3xl glass-panel rounded-3xl p-8 mb-8">
              <FileUpload onDataReceived={handleDataReceived} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* Left Data Table Section */}
            <div className="xl:col-span-7 glass-panel rounded-3xl p-6 flex flex-col h-[700px]">
              <div className="flex justify-between items-end mb-6 px-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dataset Terminal</h2>
                  <div className="flex items-center mt-2">
                     <span className="relative flex h-2.5 w-2.5 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                     <p className="text-xs text-slate-500 font-mono">
                      SYNCED: First {csvData.data.length} / {csvData.totalRows} rows
                     </p>
                  </div>
                </div>
                <button 
                  onClick={() => setCsvData(null)} 
                  className="flex items-center text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  Upload New File
                </button>
              </div>
              <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <DataTable data={csvData.data} columns={csvData.columns} />
              </div>
            </div>

            {/* Right Logic Section */}
            <div className="xl:col-span-5 glass-panel rounded-3xl p-6 flex flex-col h-[700px]">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Nexus Co-Pilot</h2>
              <p className="text-sm text-slate-500 mb-6">Ask natural language questions about your data.</p>
              <div className="flex-1 overflow-hidden relative">
                <ChatBox csvData={csvData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
