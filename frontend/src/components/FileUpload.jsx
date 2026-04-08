import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const FileUpload = ({ onDataReceived }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      // Pass parsed data and columns back to App
      onDataReceived(response.data);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onDataReceived]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto relative z-10 px-2 sm:px-0">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        {...getRootProps()} 
        className={`flex flex-col items-center justify-center p-8 sm:p-14 border-2 border-dashed rounded-2xl sm:rounded-3xl cursor-pointer transition-colors duration-300 ease-in-out relative overflow-hidden backdrop-blur-md
          ${isDragActive ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.15)]' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-500'}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Animated background glow when dragging */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 blur-xl pointer-events-none" 
            />
          )}
        </AnimatePresence>

        <motion.div 
          animate={isDragActive ? { y: -5 } : { y: 0 }}
          className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 transition-colors duration-300 z-10 
            ${isDragActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' : 'bg-slate-800 border border-slate-700 text-slate-400 shadow-inner'}`}
        >
          <UploadCloud size={40} className={`sm:w-12 sm:h-12 ${isDragActive ? 'animate-pulse' : ''}`} />
        </motion.div>

        <div className="z-10 text-center">
          {isDragActive ? (
            <p className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 font-outfit tracking-tight">Drop your intelligence here...</p>
          ) : (
            <>
              <p className="text-lg sm:text-2xl text-white font-bold mb-1 sm:mb-2 tracking-tight">
                Drag & drop a CSV file here
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-light tracking-wide">
                or click to browse your secure filesystem
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Status Messages area */}
      <div className="min-h-[64px] mt-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isUploading && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center space-x-2 sm:space-x-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm mx-4"
            >
              <File className="animate-bounce" size={16} />
              <span className="font-medium tracking-wide text-xs sm:text-sm text-center">Processing dataset vectors...</span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center space-x-2 sm:space-x-3 text-red-400 bg-red-500/10 border border-red-500/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm shadow-lg shadow-red-500/10 mx-4"
            >
              <AlertCircle size={16} />
              <span className="font-medium text-xs sm:text-sm text-center">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center space-x-2 sm:space-x-3 text-teal-400 bg-teal-500/10 border border-teal-500/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm shadow-lg shadow-teal-500/10 mx-4"
            >
              <CheckCircle2 size={16} />
              <span className="font-medium text-xs sm:text-sm text-center">Dataset successfully synced.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUpload;
