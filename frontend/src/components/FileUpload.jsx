import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className={`p-4 rounded-full mb-6 transition-colors duration-300 ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-white shadow-sm border border-slate-100 text-slate-400'}`}>
          <UploadCloud size={40} className={isDragActive ? 'animate-bounce' : ''} />
        </div>

        {isDragActive ? (
          <p className="text-xl font-bold text-blue-600">Drop your dataset right here...</p>
        ) : (
          <div className="text-center">
            <p className="text-xl text-slate-800 font-semibold mb-2">
              Drag & drop a CSV file here
            </p>
            <p className="text-sm text-slate-500 font-medium">
              or click to browse your computer
            </p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {isUploading && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600 animate-pulse">
          <File className="animate-bounce" size={20} />
          <span>Uploading and processing...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center font-medium shadow-sm">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle2 size={20} />
          <span>File uploaded successfully!</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
